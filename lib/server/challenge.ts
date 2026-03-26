import { createHmac, randomBytes, timingSafeEqual } from "crypto";

const DEFAULT_TTL_MS = 5 * 60 * 1000;

function secret(): string {
  return (
    process.env.CHALLENGE_HMAC_SECRET ??
    "dev-only-challenge-secret-change-in-production"
  );
}

export type MathChallengePayload = {
  a: number;
  b: number;
  expiresAt: number;
  nonce: string;
  signature: string;
};

/**
 * Desafío interno (no reCAPTCHA): suma simple + HMAC con caducidad.
 */
export function createMathChallenge(): MathChallengePayload {
  const a = Math.floor(Math.random() * 10) + 1;
  const b = Math.floor(Math.random() * 10) + 1;
  const expiresAt = Date.now() + DEFAULT_TTL_MS;
  const nonce = randomBytes(12).toString("hex");
  const signature = signChallenge({ a, b, expiresAt, nonce });
  return { a, b, expiresAt, nonce, signature };
}

function signChallenge(parts: {
  a: number;
  b: number;
  expiresAt: number;
  nonce: string;
}): string {
  const payload = `${parts.a}|${parts.b}|${parts.expiresAt}|${parts.nonce}`;
  return createHmac("sha256", secret()).update(payload, "utf8").digest("hex");
}

function signaturesEqual(a: string, b: string): boolean {
  try {
    const ba = Buffer.from(a, "hex");
    const bb = Buffer.from(b, "hex");
    if (ba.length !== bb.length) return false;
    return timingSafeEqual(ba, bb);
  } catch {
    return false;
  }
}

export function verifyMathChallenge(input: {
  answer?: unknown;
  a?: unknown;
  b?: unknown;
  expiresAt?: unknown;
  nonce?: unknown;
  signature?: unknown;
}): boolean {
  const a = Number(input.a);
  const b = Number(input.b);
  const expiresAt = Number(input.expiresAt);
  const nonce =
    typeof input.nonce === "string" ? input.nonce.slice(0, 64) : "";
  const signature =
    typeof input.signature === "string" ? input.signature.slice(0, 128) : "";
  const answer = Number(input.answer);

  if (
    !Number.isFinite(a) ||
    !Number.isFinite(b) ||
    !Number.isFinite(expiresAt) ||
    !Number.isFinite(answer) ||
    !nonce ||
    !signature
  ) {
    return false;
  }

  if (Date.now() > expiresAt) {
    return false;
  }

  const expected = signChallenge({ a, b, expiresAt, nonce });
  if (!signaturesEqual(expected, signature)) {
    return false;
  }

  if (Math.round(answer) !== a + b) {
    return false;
  }

  return true;
}
