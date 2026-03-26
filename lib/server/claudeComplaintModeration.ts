import Anthropic from "@anthropic-ai/sdk";
import {
  anthropicApiKey,
  anthropicModel,
  skipComplaintModeration,
} from "@/lib/config/anthropic";
import type {
  ComplaintModerationResult,
  ModerationBlockReason,
  ModerationFlags,
  ModerationSeverity,
} from "@/lib/domain/moderation";
import { ComplaintModerationUnavailableError } from "@/lib/domain/errors";
import { countryLabel } from "@/lib/domain/countries";
import { logger } from "@/lib/logger";

const MODULE = "claudeComplaintModeration";

const BLOCK_MESSAGES: Record<Exclude<ModerationBlockReason, "none">, string> = {
  personal_names:
    "No podés mencionar nombres de personas. Centrá la queja en la marca o el servicio.",
  pii_sensitive:
    "Tu mensaje no puede incluir teléfonos, direcciones, documentos ni otros datos personales.",
  individual_targeting:
    "Las quejas van dirigidas a la empresa, no a personas concretas. Reformulá sin nombres ni descripciones de individuos.",
  other:
    "Tu mensaje no cumple las reglas de publicación. Revisalo e intentá de nuevo.",
};

function extractJsonObject(raw: string): string {
  const t = raw.trim();
  const fence = /^```(?:json)?\s*([\s\S]*?)```$/m.exec(t);
  if (fence?.[1]) return fence[1].trim();
  const start = t.indexOf("{");
  const end = t.lastIndexOf("}");
  if (start >= 0 && end > start) return t.slice(start, end + 1);
  return t;
}

function isSeverity(x: unknown): x is ModerationSeverity {
  return (
    x === "clean" ||
    x === "spam" ||
    x === "coordinated" ||
    x === "noise"
  );
}

function isBlockReason(x: unknown): x is ModerationBlockReason {
  return (
    x === "none" ||
    x === "personal_names" ||
    x === "pii_sensitive" ||
    x === "individual_targeting" ||
    x === "other"
  );
}

function parseModerationPayload(
  parsed: Record<string, unknown>,
  fallbackCompany: string,
): {
  blocked: boolean;
  blockReason: ModerationBlockReason;
  userMessageEs?: string;
  canonicalCompany: string;
  severity: ModerationSeverity;
  flags: ModerationFlags;
} {
  const blocked = parsed.blocked === true;
  const blockReason: ModerationBlockReason = isBlockReason(parsed.block_reason)
    ? parsed.block_reason
    : "other";
  const userMessageEs =
    typeof parsed.user_message_es === "string"
      ? parsed.user_message_es.trim()
      : undefined;
  const canonicalRaw =
    typeof parsed.canonical_company === "string"
      ? parsed.canonical_company.trim()
      : "";
  const canonicalCompany =
    canonicalRaw.length > 0 ? canonicalRaw : fallbackCompany.trim();
  const severity: ModerationSeverity = isSeverity(parsed.severity)
    ? parsed.severity
    : "clean";
  const f = parsed.flags;
  const flags: ModerationFlags =
    f && typeof f === "object" && !Array.isArray(f)
      ? (f as ModerationFlags)
      : {};

  return {
    blocked,
    blockReason,
    userMessageEs,
    canonicalCompany,
    severity,
    flags,
  };
}

function blockedUserMessage(
  reason: ModerationBlockReason,
  modelMessage?: string,
): string {
  if (reason === "personal_names") return BLOCK_MESSAGES.personal_names;
  if (reason === "pii_sensitive") return BLOCK_MESSAGES.pii_sensitive;
  if (reason === "individual_targeting") {
    return BLOCK_MESSAGES.individual_targeting;
  }
  if (
    reason === "other" &&
    modelMessage &&
    modelMessage.length >= 10 &&
    modelMessage.length <= 400
  ) {
    return modelMessage;
  }
  return BLOCK_MESSAGES.other;
}

/**
 * Moderación con Claude: PII / personas / individuos, severidad (spam, coordinado, ruido),
 * y nombre canónico de marca para unificar variantes (ej. Movistar / Movistar Arg).
 */
export async function moderateComplaintWithClaude(input: {
  company: string;
  text: string;
  countryCode: string;
}): Promise<
  | { ok: true; result: ComplaintModerationResult }
  | { ok: false; message: string }
> {
  const company = input.company.trim();
  const text = input.text.trim();
  const countryCode = input.countryCode.trim().toUpperCase();
  const countryName = countryLabel(countryCode) ?? countryCode;

  if (skipComplaintModeration()) {
    const auditJson = JSON.stringify({
      skipped: true,
      model: null,
      severity: "clean" as const,
      countryCode,
    });
    return {
      ok: true,
      result: {
        canonicalCompany: company,
        severity: "clean",
        noiseFromSeverity: false,
        flags: {},
        auditJson,
      },
    };
  }

  const apiKey = anthropicApiKey();
  if (!apiKey) {
    logger.error(MODULE, "moderateComplaintWithClaude", "ANTHROPIC_API_KEY missing", {});
    throw new ComplaintModerationUnavailableError(
      "Moderación no configurada. Contactá al administrador del sitio.",
    );
  }

  const model = anthropicModel();
  const client = new Anthropic({ apiKey });

  const system = `Sos un moderador de contenido para "Mal de Muchos", una plataforma de quejas anónimas contra empresas (español).

El usuario indica el PAÍS / mercado donde ocurrió el problema (ISO 3166-1 alpha-2). Una misma marca puede operar en varios países con entidades distintas: usá ese país para desambiguar y para el "canonical_company" (nombre corto de la marca en ESE mercado, sin incluir el país en el nombre salvo que sea parte oficial del nombre comercial en ese mercado).

Tu tarea:
1) Detectar si el texto viola reglas: nombres propios de PERSONAS (empleados, repartidores, etc.), datos sensibles (teléfonos, DNI/CUIL, mails, direcciones exactas, números de tarjeta), o ataques dirigidos a INDIVIDUOS. Las marcas y empresas están permitidas.
2) Clasificar severidad del mensaje respecto al ecosistema público:
   - "clean": queja legítima sobre marca/servicio.
   - "spam": promoción, texto sin sentido, relleno, flood.
   - "coordinated": indicios de campaña coordinada o plantillas repetidas para manipular ranking.
   - "noise": baja calidad, demasiado vago, o no aporta señal útil (pero no es spam claro).
3) Proponer "canonical_company": el nombre corto y estable de la PERSONA JURÍDICA / marca en el mercado indicado (ej. "Movistar" para variantes de escritura). Sin incluir nombres de personas.

Respondé SOLO con un JSON válido (sin markdown), con esta forma exacta:
{
  "blocked": boolean,
  "block_reason": "none" | "personal_names" | "pii_sensitive" | "individual_targeting" | "other",
  "user_message_es": string,
  "canonical_company": string,
  "severity": "clean" | "spam" | "coordinated" | "noise",
  "flags": {
    "likely_person_names": boolean,
    "likely_phone_or_doc": boolean,
    "likely_address": boolean,
    "targets_individual_not_brand": boolean,
    "spam_signals": boolean,
    "coordination_signals": boolean,
    "low_quality_or_noise": boolean
  }
}

Si blocked=true, "user_message_es" debe ser un mensaje breve y respetuoso para el usuario explicando por qué no puede publicar (sin citar datos sensibles del mensaje).
Si blocked=false, "canonical_company" debe ser no vacío.`;

  const user = `País / mercado (ISO): ${countryCode} (${countryName})

Empresa indicada por el usuario (texto libre): ${JSON.stringify(company)}

Texto de la queja:
${text}`;

  let textOut = "";
  try {
    const response = await client.messages.create({
      model,
      max_tokens: 1200,
      system,
      messages: [{ role: "user", content: user }],
    });
    const block = response.content.find((b) => b.type === "text");
    if (block?.type === "text") {
      textOut = block.text;
    }
  } catch (e) {
    logger.error(MODULE, "moderateComplaintWithClaude", "Anthropic API error", {
      error: String(e),
    });
    throw new ComplaintModerationUnavailableError();
  }

  if (!textOut) {
    logger.error(MODULE, "moderateComplaintWithClaude", "Empty model response", {});
    throw new ComplaintModerationUnavailableError();
  }

  let parsed: Record<string, unknown>;
  try {
    parsed = JSON.parse(extractJsonObject(textOut)) as Record<string, unknown>;
  } catch (e) {
    logger.error(MODULE, "moderateComplaintWithClaude", "JSON parse failed", {
      error: String(e),
    });
    throw new ComplaintModerationUnavailableError();
  }

  const m = parseModerationPayload(parsed, company);

  if (m.blocked) {
    const msg = blockedUserMessage(m.blockReason, m.userMessageEs);
    logger.info(MODULE, "moderateComplaintWithClaude", "Complaint blocked by policy", {
      blockReason: m.blockReason,
    });
    return { ok: false, message: msg };
  }

  const noiseFromSeverity = m.severity !== "clean";
  const auditJson = JSON.stringify({
    severity: m.severity,
    flags: m.flags,
    model,
    blocked: false,
    countryCode,
  });

  logger.info(MODULE, "moderateComplaintWithClaude", "Moderation completed", {
    severity: m.severity,
    noiseFromSeverity,
  });

  return {
    ok: true,
    result: {
      canonicalCompany: m.canonicalCompany,
      severity: m.severity,
      noiseFromSeverity,
      flags: m.flags,
      auditJson,
    },
  };
}
