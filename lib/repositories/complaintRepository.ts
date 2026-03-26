import type { Brand, Complaint } from "@prisma/client";
import type { ModerationSeverity } from "@/lib/domain/moderation";
import type { ComplaintPublic, ReactionType, WallEntry, WallTrend } from "@/lib/domain/types";
import { normalizeCompanyName } from "@/lib/domain/companyNormalize";
import {
  spamMaxDistinctCompaniesPerWindow,
  spamMaxPostsPerWindow,
  spamWindowMs,
} from "@/lib/config/spam";
import { prisma } from "@/lib/db/prisma";
import { logger } from "@/lib/logger";

type ComplaintWithBrand = Complaint & { brand: Brand };

function toPublic(c: ComplaintWithBrand): ComplaintPublic {
  return {
    id: c.id,
    company: c.brand.displayName,
    countryCode: c.brand.countryCode,
    text: c.text,
    intensity: c.intensity,
    createdAt: c.createdAt.toISOString(),
    reactions: {
      meToo: c.reactionMeToo,
      indignante: c.reactionIndignante,
    },
  };
}

async function findOrCreateBrand(
  displayName: string,
  countryCode: string,
): Promise<Brand> {
  const norm = normalizeCompanyName(displayName);
  const trimmed = displayName.trim();
  const cc = countryCode.trim().toUpperCase();
  return prisma.brand.upsert({
    where: {
      normalizedName_countryCode: { normalizedName: norm, countryCode: cc },
    },
    create: {
      normalizedName: norm,
      countryCode: cc,
      displayName: trimmed,
    },
    update: { displayName: trimmed },
  });
}

async function evaluateNoise(
  visitorHash: string,
  brandId: string,
  now: number,
): Promise<boolean> {
  const windowMs = spamWindowMs();
  const maxPosts = spamMaxPostsPerWindow();
  const maxCompanies = spamMaxDistinctCompaniesPerWindow();
  const windowStart = new Date(now - windowMs);

  const recent = await prisma.complaint.findMany({
    where: {
      visitorHash,
      createdAt: { gte: windowStart },
    },
    select: { brandId: true },
  });

  if (recent.length >= maxPosts) {
    return true;
  }

  const companies = new Set<string>();
  for (const r of recent) {
    companies.add(r.brandId);
  }
  companies.add(brandId);
  if (companies.size >= maxCompanies) {
    return true;
  }

  return false;
}

function trendFrom(prevRank: number | null, newRank: number): WallTrend {
  if (prevRank === null || prevRank === undefined) return "new";
  if (newRank < prevRank) return "up";
  if (newRank > prevRank) return "down";
  return "same";
}

export async function listComplaints(
  limit: number,
  cursor?: string,
): Promise<{ items: ComplaintPublic[]; nextCursor: string | null }> {
  const take = limit + 1;
  let cursorRow: Complaint | null = null;
  if (cursor) {
    cursorRow = await prisma.complaint.findUnique({ where: { id: cursor } });
  }

  const rows = await prisma.complaint.findMany({
    where: {
      noise: false,
      ...(cursorRow ? { createdAt: { lt: cursorRow.createdAt } } : {}),
    },
    orderBy: [{ createdAt: "desc" }, { id: "desc" }],
    take,
    include: { brand: true },
  });

  const hasMore = rows.length > limit;
  const page = hasMore ? rows.slice(0, limit) : rows;
  const nextCursor =
    hasMore && page.length > 0 ? page[page.length - 1]!.id : null;

  return {
    items: page.map((r) => toPublic(r)),
    nextCursor,
  };
}

export async function createComplaint(input: {
  company: string;
  countryCode: string;
  text: string;
  intensity: number;
  visitorHash: string;
  moderation?: {
    severity: ModerationSeverity;
    auditJson: string;
  };
}): Promise<ComplaintPublic> {
  const company = input.company.trim();
  const text = input.text.trim();
  const cc = input.countryCode.trim().toUpperCase();
  const brand = await findOrCreateBrand(company, cc);
  const now = Date.now();
  const rateNoise = await evaluateNoise(input.visitorHash, brand.id, now);
  const aiNoise =
    input.moderation && input.moderation.severity !== "clean";
  const noise = rateNoise || Boolean(aiNoise);

  const row = await prisma.complaint.create({
    data: {
      brandId: brand.id,
      text,
      intensity: input.intensity,
      visitorHash: input.visitorHash,
      noise,
      moderationSeverity: input.moderation?.severity ?? null,
      moderationFlagsJson: input.moderation?.auditJson ?? null,
    },
    include: { brand: true },
  });

  logger.info("complaintRepository", "createComplaint", "Complaint created", {
    id: row.id,
    brandId: brand.id,
    countryCode: cc,
    noise,
    moderationSeverity: input.moderation?.severity ?? null,
  });

  const pub = toPublic(row);
  if (noise) {
    return { ...pub, noise: true };
  }
  return pub;
}

export async function addReaction(
  id: string,
  type: ReactionType,
): Promise<ComplaintPublic | null> {
  const field =
    type === "meToo" ? "reactionMeToo" : "reactionIndignante";
  try {
    const updated = await prisma.complaint.update({
      where: { id },
      data: {
        [field]: { increment: 1 },
      },
      include: { brand: true },
    });
    logger.debug("complaintRepository", "addReaction", "Reaction added", {
      id,
      type,
    });
    return toPublic(updated);
  } catch {
    return null;
  }
}

export async function suggestCompanies(
  query: string,
  limit: number,
  countryCode: string,
): Promise<string[]> {
  const cc = countryCode.trim().toUpperCase();
  const q = query.trim().toLowerCase();
  if (!q.length) {
    const brands = await prisma.brand.findMany({
      where: { countryCode: cc },
      take: limit,
      orderBy: { displayName: "asc" },
      select: { displayName: true },
    });
    return brands.map((b) => b.displayName);
  }

  const brands = await prisma.brand.findMany({
    where: {
      countryCode: cc,
      OR: [
        { normalizedName: { contains: q } },
        { displayName: { contains: query.trim() } },
      ],
    },
    take: limit,
    orderBy: { displayName: "asc" },
    select: { displayName: true },
  });
  return brands.map((b) => b.displayName);
}

export async function getWallTop(limit: number): Promise<WallEntry[]> {
  const grouped = await prisma.complaint.groupBy({
    by: ["brandId"],
    where: { noise: false },
    _count: { id: true },
    _sum: { intensity: true },
  });

  const withMeta = await Promise.all(
    grouped.map(async (g) => {
      const brand = await prisma.brand.findUnique({
        where: { id: g.brandId },
      });
      if (!brand) return null;
      const complaintCount = g._count.id;
      const intensitySum = g._sum.intensity ?? 0;
      const hateScore = complaintCount * 10 + intensitySum;
      return {
        brandId: g.brandId,
        company: brand.displayName,
        countryCode: brand.countryCode,
        complaintCount,
        hateScore,
      };
    }),
  );

  const ranked = withMeta
    .filter((x): x is NonNullable<typeof x> => x !== null)
    .sort(
      (a, b) =>
        b.hateScore - a.hateScore || b.complaintCount - a.complaintCount,
    )
    .slice(0, limit);

  if (ranked.length === 0) {
    await prisma.brand.updateMany({ data: { lastWallRank: null } });
    return [];
  }

  const brandIds = ranked.map((r) => r.brandId);
  const brandsPrev = await prisma.brand.findMany({
    where: { id: { in: brandIds } },
    select: { id: true, lastWallRank: true },
  });
  const prevMap = new Map(
    brandsPrev.map((b) => [b.id, b.lastWallRank]),
  );

  const result: WallEntry[] = ranked.map((row, index) => {
    const prev = prevMap.get(row.brandId) ?? null;
    const trend = trendFrom(prev, index);
    return {
      rank: index + 1,
      company: row.company,
      countryCode: row.countryCode,
      hateScore: row.hateScore,
      complaintCount: row.complaintCount,
      trend,
    };
  });

  await prisma.$transaction([
    prisma.brand.updateMany({
      where: {
        id: { notIn: brandIds },
        lastWallRank: { not: null },
      },
      data: { lastWallRank: null },
    }),
    ...ranked.map((row, i) =>
      prisma.brand.update({
        where: { id: row.brandId },
        data: { lastWallRank: i },
      }),
    ),
  ]);

  return result;
}
