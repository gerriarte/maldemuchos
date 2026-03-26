import { NextResponse } from "next/server";
import { createMathChallenge } from "@/lib/server/challenge";

/**
 * Entrega un desafío matemático firmado (anti-bot interno, sin Google).
 */
export async function GET() {
  const challenge = createMathChallenge();
  return NextResponse.json(challenge);
}
