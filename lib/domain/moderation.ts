export type ModerationSeverity = "clean" | "spam" | "coordinated" | "noise";

export type ModerationBlockReason =
  | "none"
  | "personal_names"
  | "pii_sensitive"
  | "individual_targeting"
  | "other";

export type ModerationFlags = {
  likely_person_names?: boolean;
  likely_phone_or_doc?: boolean;
  likely_address?: boolean;
  targets_individual_not_brand?: boolean;
  spam_signals?: boolean;
  coordination_signals?: boolean;
  low_quality_or_noise?: boolean;
};

/** Resultado de moderación previo a persistir la queja. */
export type ComplaintModerationResult = {
  canonicalCompany: string;
  severity: ModerationSeverity;
  /** true si la severidad no es clean (entra al flujo de ruido). */
  noiseFromSeverity: boolean;
  flags: ModerationFlags;
  /** JSON para auditoría en DB (sin texto crudo de la queja). */
  auditJson: string;
};
