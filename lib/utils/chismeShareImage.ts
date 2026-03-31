import { countryLabel } from "@/lib/domain/countries";
import type { ComplaintPublic } from "@/lib/domain/types";

const W = 1920;
const H = 1920;
const PAD = 96;
const CONTENT_W = W - PAD * 2;

const BG = "#0a0a0a";
const ACCENT = "#e5ff00";
const PAIN = "#ff3b30";
const TEXT = "#ffffff";
const MUTED = "#888888";

function wrapLines(
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number,
): string[] {
  const words = text.split(/\s+/).filter(Boolean);
  const lines: string[] = [];
  let current = "";

  const pushLine = (line: string) => {
    if (line) lines.push(line);
  };

  const breakLongWord = (word: string): string[] => {
    if (ctx.measureText(word).width <= maxWidth) return [word];
    const out: string[] = [];
    let chunk = "";
    for (const ch of word) {
      const next = chunk + ch;
      if (ctx.measureText(next).width > maxWidth && chunk) {
        out.push(chunk);
        chunk = ch;
      } else {
        chunk = next;
      }
    }
    if (chunk) out.push(chunk);
    return out;
  };

  for (const word of words) {
    const test = current ? `${current} ${word}` : word;
    if (ctx.measureText(test).width <= maxWidth) {
      current = test;
      continue;
    }
    if (current) {
      pushLine(current);
      current = "";
    }
    const parts = breakLongWord(word);
    for (let i = 0; i < parts.length; i++) {
      const p = parts[i]!;
      if (i < parts.length - 1) {
        pushLine(p);
      } else {
        current = p;
      }
    }
  }
  pushLine(current);
  return lines;
}

function fitTextBlock(params: {
  ctx: CanvasRenderingContext2D;
  text: string;
  maxWidth: number;
  maxHeight: number;
  maxFont: number;
  minFont: number;
  lineHeightRatio: number;
}): { lines: string[]; fontSize: number; lineHeight: number } {
  const {
    ctx,
    text,
    maxWidth,
    maxHeight,
    maxFont,
    minFont,
    lineHeightRatio,
  } = params;

  for (let fontSize = maxFont; fontSize >= minFont; fontSize -= 2) {
    const lineHeight = Math.floor(fontSize * lineHeightRatio);
    ctx.font = `700 ${fontSize}px "Space Mono", "Courier New", monospace`;
    const lines = wrapLines(ctx, text, maxWidth);
    const usedHeight = lines.length * lineHeight;
    if (usedHeight <= maxHeight) {
      return { lines, fontSize, lineHeight };
    }
  }

  const fallbackFont = minFont;
  const fallbackLineHeight = Math.floor(minFont * lineHeightRatio);
  ctx.font = `700 ${fallbackFont}px "Space Mono", "Courier New", monospace`;
  return {
    lines: wrapLines(ctx, text, maxWidth),
    fontSize: fallbackFont,
    lineHeight: fallbackLineHeight,
  };
}

/**
 * Imagen 1920×1920 (1:1) para compartir chismes.
 */
export async function generateChismeShareImage(
  complaint: ComplaintPublic,
  _pageUrl: string,
): Promise<Blob> {
  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    throw new Error("Canvas no disponible");
  }

  await document.fonts.ready;

  ctx.fillStyle = BG;
  ctx.fillRect(0, 0, W, H);

  ctx.strokeStyle = "#ffffff";
  ctx.lineWidth = 8;
  ctx.strokeRect(40, 40, W - 80, H - 80);

  ctx.fillStyle = ACCENT;
  ctx.fillRect(40, 40, 14, H - 80);

  const market = countryLabel(complaint.countryCode) ?? complaint.countryCode;
  const created = new Date(complaint.createdAt).toLocaleString("es-AR", {
    dateStyle: "short",
    timeStyle: "short",
  });

  const shareText = [
    `EMPRESA: ${complaint.company.trim().toUpperCase()}`,
    `PAIS: ${market.toUpperCase()}`,
    `INTENSIDAD: ${complaint.intensity}/10`,
    `REACCIONES: ME TOO ${complaint.reactions.meToo} | INDIGNANTE ${complaint.reactions.indignante}`,
    `FECHA: ${created.toUpperCase()}`,
    "",
    `QUEJA: ${complaint.text.replace(/\s+/g, " ").trim()}`,
    "",
    "MALDEMUCHOS.COM",
  ].join("\n");
  const sourceUrl = _pageUrl.trim() || "https://maldemuchos.com";

  const titleY = PAD + 36;
  ctx.fillStyle = ACCENT;
  ctx.font = '800 64px "Archivo Black", Impact, "Arial Black", sans-serif';
  ctx.fillText("CHISME PUBLICO", PAD, titleY);

  const blockTop = Math.floor(H * 0.12);
  const blockHeight = Math.floor(H * 0.8);
  const fitted = fitTextBlock({
    ctx,
    text: shareText,
    maxWidth: CONTENT_W,
    maxHeight: blockHeight,
    maxFont: 74,
    minFont: 28,
    lineHeightRatio: 1.24,
  });

  ctx.font = `700 ${fitted.fontSize}px "Space Mono", "Courier New", monospace`;
  let y = blockTop;
  for (const line of fitted.lines) {
    const upper = line.toUpperCase();
    if (upper.includes("MALDEMUCHOS.COM")) {
      ctx.fillStyle = ACCENT;
    } else if (upper.startsWith("EMPRESA:")) {
      ctx.fillStyle = PAIN;
    } else {
      ctx.fillStyle = TEXT;
    }
    ctx.fillText(upper, PAD, y);
    y += fitted.lineHeight;
  }

  ctx.fillStyle = MUTED;
  ctx.font = '500 30px "Space Mono", "Courier New", monospace';
  ctx.fillText("FUENTE: MALDEMUCHOS.COM", PAD, H - PAD);
  ctx.fillText(
    `ORIGEN: ${sourceUrl.slice(0, 72).toUpperCase()}`,
    PAD,
    H - PAD - 40,
  );

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) resolve(blob);
        else reject(new Error("No se pudo generar la imagen"));
      },
      "image/png",
      1,
    );
  });
}

export function buildWhatsappChismeUrl(
  complaint: ComplaintPublic,
  pageUrl: string,
): string {
  const body =
    complaint.text.length > 500
      ? `${complaint.text.slice(0, 497).trim()}…`
      : complaint.text;
  const msg = `*${complaint.company.trim()}*\n\n${body}\n\n${pageUrl}`;
  return `https://wa.me/?text=${encodeURIComponent(msg)}`;
}

/**
 * Intenta compartir la imagen (Instagram, archivos, etc.); si no, descarga PNG y copia el link.
 */
export async function shareChismeWithImage(complaint: ComplaintPublic): Promise<void> {
  const pageUrl =
    typeof window !== "undefined" ? window.location.href : "";
  const blob = await generateChismeShareImage(complaint, pageUrl);
  const filename = safeShareFilename(complaint.company);
  const file = new File([blob], filename, { type: "image/png" });
  const shareText = `${complaint.company}: ${complaint.text.slice(0, 140)}…`;

  const tryFiles = async (): Promise<boolean> => {
    if (!navigator.canShare?.({ files: [file] })) {
      return false;
    }
    await navigator.share({
      files: [file],
      title: "Mal de Muchos",
      text: shareText,
      url: pageUrl,
    });
    return true;
  };

  try {
    if (await tryFiles()) return;
  } catch (e) {
    if ((e as Error).name === "AbortError") return;
  }

  try {
    if (navigator.share) {
      await navigator.share({
        title: "Mal de Muchos",
        text: `${shareText}\n\n${pageUrl}`,
        url: pageUrl,
      });
    }
  } catch (e) {
    if ((e as Error).name === "AbortError") return;
  }

  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.rel = "noopener";
  a.click();
  URL.revokeObjectURL(url);

  try {
    await navigator.clipboard.writeText(pageUrl);
  } catch {
    /* noop */
  }
}

export function safeShareFilename(company: string): string {
  const base = company
    .trim()
    .slice(0, 40)
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .toLowerCase();
  return `mal-de-muchos-${base || "chisme"}.png`;
}
