import { NextResponse } from "next/server";
import { AnalyticsUnauthorizedError } from "@/lib/domain/errors";
import { logger } from "@/lib/logger";
import { getAnalyticsSummary } from "@/lib/repositories/analyticsRepository";
import { assertAnalyticsAuthorized } from "@/lib/server/analyticsAuth";

const MODULE = "api/analytics";

function parseDateParam(value: string | null, fallback: Date): Date {
  if (!value?.trim()) return fallback;
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) {
    throw new Error("Fecha inválida");
  }
  return d;
}

export async function GET(request: Request) {
  try {
    assertAnalyticsAuthorized(request);

    const { searchParams } = new URL(request.url);
    const defaultTo = new Date();
    const defaultFrom = new Date(defaultTo);
    defaultFrom.setUTCDate(defaultFrom.getUTCDate() - 30);

    let from: Date;
    let to: Date;
    try {
      from = parseDateParam(searchParams.get("from"), defaultFrom);
      to = parseDateParam(searchParams.get("to"), defaultTo);
    } catch {
      return NextResponse.json(
        { error: "Parámetros from/to inválidos (usar ISO 8601)" },
        { status: 400 },
      );
    }

    if (from.getTime() > to.getTime()) {
      return NextResponse.json(
        { error: "from debe ser anterior o igual a to" },
        { status: 400 },
      );
    }

    const summary = await getAnalyticsSummary(from, to);
    logger.info(MODULE, "GET", "Analytics summary", {
      complaints: summary.totals.complaints,
    });
    return NextResponse.json(summary);
  } catch (e) {
    if (e instanceof AnalyticsUnauthorizedError) {
      return NextResponse.json({ error: e.message }, { status: 401 });
    }
    logger.error(MODULE, "GET", "Analytics failed", { error: String(e) });
    return NextResponse.json({ error: "internal_error" }, { status: 500 });
  }
}
