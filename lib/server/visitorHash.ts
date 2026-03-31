import { createHash } from "crypto";

/**
 * IP de la request (proxy-aware). No se persiste en claro.
 */
export function getClientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    const first = forwarded.split(",")[0]?.trim();
    if (first) return first;
  }
  const real = request.headers.get("x-real-ip")?.trim();
  if (real) return real;
  return "unknown";
}

/**
 * Hash irreversible para correlación anti-spam (IP + huella opcional del cliente).
 * Requiere IP_HASH_SALT en producción.
 */
export function hashVisitorIdentity(ip: string, clientFingerprint: string): string {
  const salt = process.env.IP_HASH_SALT?.trim();
  if (!salt) {
    throw new Error("IP_HASH_SALT is required");
  }
  const payload = `${ip}|${clientFingerprint}`;
  return createHash("sha256")
    .update(`${salt}|${payload}`, "utf8")
    .digest("hex")
    .slice(0, 40);
}
