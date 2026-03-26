import { NextResponse } from "next/server";
import { logger } from "@/lib/logger";
import { getWallTop } from "@/lib/repositories/complaintRepository";

const MODULE = "api/wall";

export async function GET() {
  try {
    const items = await getWallTop(10);
    return NextResponse.json({ items });
  } catch (e) {
    logger.error(MODULE, "GET", "Wall failed", { error: String(e) });
    return NextResponse.json({ error: "internal_error" }, { status: 500 });
  }
}
