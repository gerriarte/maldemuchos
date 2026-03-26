import { prisma } from "@/lib/db/prisma";
import type { AnalyticsSummary } from "@/lib/domain/analytics";
import { logger } from "@/lib/logger";

const MODULE = "analyticsRepository";

function dayKey(d: Date): string {
  return d.toISOString().slice(0, 10);
}

export async function getAnalyticsSummary(
  from: Date,
  to: Date,
): Promise<AnalyticsSummary> {
  const fromDay = new Date(from);
  fromDay.setUTCHours(0, 0, 0, 0);
  const toDay = new Date(to);
  toDay.setUTCHours(23, 59, 59, 999);

  const [
    complaintsInRange,
    noiseCount,
    brandsTotal,
    brandAgg,
    avgAgg,
    sentimentCount,
    reactionSums,
  ] = await Promise.all([
    prisma.complaint.count({
      where: { createdAt: { gte: fromDay, lte: toDay } },
    }),
    prisma.complaint.count({
      where: { createdAt: { gte: fromDay, lte: toDay }, noise: true },
    }),
    prisma.brand.count(),
    prisma.complaint.findMany({
      where: { createdAt: { gte: fromDay, lte: toDay } },
      select: { brandId: true },
      distinct: ["brandId"],
    }),
    prisma.complaint.aggregate({
      where: {
        createdAt: { gte: fromDay, lte: toDay },
        noise: false,
      },
      _avg: { intensity: true },
    }),
    prisma.complaint.count({
      where: {
        createdAt: { gte: fromDay, lte: toDay },
        sentimentScore: { not: null },
      },
    }),
    prisma.complaint.aggregate({
      where: { createdAt: { gte: fromDay, lte: toDay } },
      _sum: {
        reactionMeToo: true,
        reactionIndignante: true,
      },
    }),
  ]);

  const brandsWithComplaintsInPeriod = brandAgg.length;

  const rowsForDays = await prisma.complaint.findMany({
    where: { createdAt: { gte: fromDay, lte: toDay } },
    select: { createdAt: true, noise: true },
  });

  const dayMap = new Map<string, { complaints: number; noise: number }>();
  for (const r of rowsForDays) {
    const key = dayKey(r.createdAt);
    const cur = dayMap.get(key) ?? { complaints: 0, noise: 0 };
    cur.complaints += 1;
    if (r.noise) cur.noise += 1;
    dayMap.set(key, cur);
  }

  const byDay = [...dayMap.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, v]) => ({
      date,
      complaints: v.complaints,
      noise: v.noise,
    }));

  const grouped = await prisma.complaint.groupBy({
    by: ["brandId"],
    where: {
      createdAt: { gte: fromDay, lte: toDay },
      noise: false,
    },
    _count: { id: true },
    _avg: { intensity: true },
    _sum: { intensity: true },
  });

  const brandIds = grouped.map((g) => g.brandId);
  const brands =
    brandIds.length > 0
      ? await prisma.brand.findMany({
          where: { id: { in: brandIds } },
        })
      : [];
  const brandMap = new Map(brands.map((b) => [b.id, b]));

  const topWithMeta = grouped.map((g) => {
    const brand = brandMap.get(g.brandId);
    if (!brand) return null;
    const complaintCount = g._count.id;
    const intensitySum = g._sum.intensity ?? 0;
    const hateScore = complaintCount * 10 + intensitySum;
    return {
      brandId: g.brandId,
      displayName: brand.displayName,
      countryCode: brand.countryCode,
      complaintCount,
      avgIntensity: g._avg.intensity,
      hateScore,
    };
  });

  const topBrands = topWithMeta
    .filter((x): x is NonNullable<typeof x> => x !== null)
    .sort((a, b) => b.hateScore - a.hateScore || b.complaintCount - a.complaintCount)
    .slice(0, 25);

  const noiseRate =
    complaintsInRange > 0 ? noiseCount / complaintsInRange : 0;

  logger.debug(MODULE, "getAnalyticsSummary", "Built", {
    complaintsInRange,
    from: fromDay.toISOString(),
    to: toDay.toISOString(),
  });

  return {
    period: {
      from: fromDay.toISOString(),
      to: toDay.toISOString(),
    },
    totals: {
      complaints: complaintsInRange,
      noise: noiseCount,
      noiseRate: Math.round(noiseRate * 10000) / 10000,
      brandsTotal,
      brandsWithComplaintsInPeriod,
      avgIntensity: avgAgg._avg.intensity,
      withSentimentScore: sentimentCount,
      reactionsMeToo: reactionSums._sum.reactionMeToo ?? 0,
      reactionsIndignante: reactionSums._sum.reactionIndignante ?? 0,
    },
    byDay,
    topBrands,
  };
}
