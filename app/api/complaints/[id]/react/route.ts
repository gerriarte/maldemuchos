import { NextResponse } from "next/server";
import { logger } from "@/lib/logger";
import type { ReactionType } from "@/lib/domain/types";
import { addReaction } from "@/lib/repositories/complaintRepository";

const MODULE = "api/complaints/[id]/react";

export async function POST(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const { id } = await context.params;
  try {
    const body = (await request.json()) as { type?: string };
    const type = body.type as ReactionType | undefined;
    if (type !== "meToo" && type !== "indignante") {
      return NextResponse.json({ error: "invalid_reaction" }, { status: 400 });
    }
    const updated = await addReaction(id, type);
    if (!updated) {
      return NextResponse.json({ error: "not_found" }, { status: 404 });
    }
    logger.debug(MODULE, "POST", "Reaction stored", { id, type });
    return NextResponse.json(updated);
  } catch (e) {
    logger.error(MODULE, "POST", "Reaction failed", { error: String(e) });
    return NextResponse.json({ error: "internal_error" }, { status: 500 });
  }
}
