import { NextResponse } from "next/server";
import { isValidCountryCode } from "@/lib/domain/countries";
import {
  ComplaintModerationUnavailableError,
  ComplaintValidationError,
} from "@/lib/domain/errors";
import { logger } from "@/lib/logger";
import { createComplaint, listComplaints } from "@/lib/repositories/complaintRepository";
import { verifyMathChallenge } from "@/lib/server/challenge";
import { moderateComplaintWithClaude } from "@/lib/server/claudeComplaintModeration";
import { getClientIp, hashVisitorIdentity } from "@/lib/server/visitorHash";

const MODULE = "api/complaints";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const limit = Math.min(20, Math.max(1, Number(searchParams.get("limit")) || 10));
  const cursor = searchParams.get("cursor") ?? undefined;

  try {
    const { items, nextCursor } = await listComplaints(limit, cursor);
    return NextResponse.json({ items, nextCursor });
  } catch (e) {
    logger.error(MODULE, "GET", "Failed to list complaints", {
      error: String(e),
    });
    return NextResponse.json({ error: "internal_error" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      country?: string;
      company?: string;
      text?: string;
      intensity?: number;
      manifestAccepted?: boolean;
      /** Huella opcional del navegador (no PII); se combina con IP hasheada en servidor. */
      fingerprint?: string;
      /** Honeypot anti-bot: debe ir vacío. */
      website?: string;
      challenge?: {
        answer?: unknown;
        a?: unknown;
        b?: unknown;
        expiresAt?: unknown;
        nonce?: unknown;
        signature?: unknown;
      };
    };

    if (typeof body.website === "string" && body.website.trim().length > 0) {
      throw new ComplaintValidationError("No se pudo enviar el mensaje.");
    }

    if (!body.challenge || !verifyMathChallenge(body.challenge)) {
      throw new ComplaintValidationError(
        "Verificación humana incorrecta o vencida. Recargá el formulario e intentá de nuevo.",
      );
    }

    const countryRaw =
      typeof body.country === "string" ? body.country.trim().toUpperCase() : "";
    const company = typeof body.company === "string" ? body.company : "";
    const text = typeof body.text === "string" ? body.text : "";
    const intensity = Number(body.intensity);

    if (!countryRaw || !isValidCountryCode(countryRaw)) {
      throw new ComplaintValidationError(
        "Elegí un país válido del listado (mercado de la marca).",
      );
    }

    if (body.manifestAccepted !== true) {
      throw new ComplaintValidationError(
        "Tenés que aceptar las reglas de la casa antes de publicar.",
      );
    }

    if (!company.trim()) {
      throw new ComplaintValidationError("Empresa requerida");
    }
    if (!text.trim()) {
      throw new ComplaintValidationError("La queja no puede estar vacía");
    }
    if (text.length > 2000) {
      throw new ComplaintValidationError("Máximo 2000 caracteres");
    }
    if (!Number.isFinite(intensity) || intensity < 1 || intensity > 10) {
      throw new ComplaintValidationError("Intensidad entre 1 y 10");
    }

    const fpRaw =
      typeof body.fingerprint === "string" ? body.fingerprint.slice(0, 128) : "";
    const ip = getClientIp(request);
    const visitorHash = hashVisitorIdentity(ip, fpRaw);

    const mod = await moderateComplaintWithClaude({
      company,
      text,
      countryCode: countryRaw,
    });
    if (!mod.ok) {
      throw new ComplaintValidationError(mod.message);
    }

    const created = await createComplaint({
      company: mod.result.canonicalCompany,
      countryCode: countryRaw,
      text,
      intensity: Math.round(intensity),
      visitorHash,
      moderation: {
        severity: mod.result.severity,
        auditJson: mod.result.auditJson,
      },
    });
    logger.info(MODULE, "POST", "Complaint accepted", { id: created.id });
    return NextResponse.json(created, { status: 201 });
  } catch (e) {
    if (e instanceof ComplaintValidationError) {
      return NextResponse.json({ error: e.message }, { status: 400 });
    }
    if (e instanceof ComplaintModerationUnavailableError) {
      return NextResponse.json({ error: e.message }, { status: 503 });
    }
    logger.error(MODULE, "POST", "Failed to create complaint", {
      error: String(e),
    });
    return NextResponse.json({ error: "internal_error" }, { status: 500 });
  }
}
