import { countryLabel } from "@/lib/domain/countries";
import type { ComplaintPublic } from "@/lib/domain/types";

const W = 1080;
const H = 1920;
const PAD = 48;
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

/**
 * Imagen 1080×1920 (9:16) para historias / posts; estética brutalista de Mal de Muchos.
 */
export async function generateChismeShareImage(
  complaint: ComplaintPublic,
  pageUrl: string,
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
  ctx.lineWidth = 4;
  ctx.strokeRect(24, 24, W - 48, H - 48);

  ctx.fillStyle = ACCENT;
  ctx.fillRect(24, 24, 8, 120);

  let y = PAD + 36;

  ctx.fillStyle = ACCENT;
  ctx.font = '400 26px "Archivo Black", Impact, "Arial Black", sans-serif';
  ctx.fillText("MAL DE MUCHOS", PAD, y);
  y += 56;

  ctx.fillStyle = PAIN;
  ctx.font = '400 48px "Archivo Black", Impact, "Arial Black", sans-serif';
  const company = (complaint.company.trim() || "—").toUpperCase();
  const companyLines = wrapLines(ctx, company, CONTENT_W);
  for (const line of companyLines.slice(0, 6)) {
    ctx.fillText(line, PAD, y);
    y += 58;
  }
  const mkt =
    countryLabel(complaint.countryCode) ?? complaint.countryCode;
  ctx.fillStyle = MUTED;
  ctx.font = '400 20px "Space Mono", "Courier New", monospace';
  ctx.fillText(mkt.toUpperCase(), PAD, y);
  y += 36;

  const rawBody =
    complaint.text.length > 900
      ? `${complaint.text.slice(0, 897).trim()}…`
      : complaint.text;

  ctx.fillStyle = TEXT;
  ctx.font = '400 30px "Space Mono", "Courier New", monospace';
  const bodyLines = wrapLines(ctx, rawBody, CONTENT_W);
  const maxBodyLines = Math.min(bodyLines.length, 28);
  const maxY = H - PAD - 120;
  for (let i = 0; i < maxBodyLines; i++) {
    if (y > maxY) break;
    ctx.fillText(bodyLines[i]!, PAD, y);
    y += 40;
  }

  ctx.strokeStyle = "rgba(255,255,255,0.2)";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(PAD, H - 100);
  ctx.lineTo(W - PAD, H - 100);
  ctx.stroke();

  ctx.fillStyle = MUTED;
  ctx.font = '400 22px "Space Mono", "Courier New", monospace';
  const urlLines = wrapLines(ctx, pageUrl, CONTENT_W);
  let uy = H - 72;
  for (const line of urlLines.slice(0, 2)) {
    ctx.fillText(line, PAD, uy);
    uy += 28;
  }

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
