export type ReactionType = "meToo" | "indignante";

export type ComplaintPublic = {
  id: string;
  company: string;
  /** ISO 3166-1 alpha-2: mercado de la queja (marca puede repetirse en otro país). */
  countryCode: string;
  text: string;
  intensity: number;
  createdAt: string;
  reactions: Record<ReactionType, number>;
  /** Solo en respuesta POST si la entrada fue clasificada como ruido anti-spam. */
  noise?: boolean;
};

export type WallTrend = "up" | "down" | "same" | "new";

export type WallEntry = {
  rank: number;
  company: string;
  countryCode: string;
  hateScore: number;
  complaintCount: number;
  trend: WallTrend;
};
