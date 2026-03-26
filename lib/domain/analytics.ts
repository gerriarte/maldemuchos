/** Respuesta JSON para dashboards y BI (solo lectura). */
export type AnalyticsSummary = {
  period: { from: string; to: string };
  totals: {
    complaints: number;
    noise: number;
    noiseRate: number;
    brandsTotal: number;
    brandsWithComplaintsInPeriod: number;
    avgIntensity: number | null;
    withSentimentScore: number;
    reactionsMeToo: number;
    reactionsIndignante: number;
  };
  byDay: Array<{ date: string; complaints: number; noise: number }>;
  topBrands: Array<{
    brandId: string;
    displayName: string;
    countryCode: string;
    complaintCount: number;
    avgIntensity: number | null;
    hateScore: number;
  }>;
};
