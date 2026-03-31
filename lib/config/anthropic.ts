/** API key de Anthropic (obligatorio si la moderación está activa). */
export function anthropicApiKey(): string | undefined {
  const k = process.env.ANTHROPIC_API_KEY?.trim();
  return k || undefined;
}

/** Modelo Claude (Messages API). */
export function anthropicModel(): string {
  return (
    process.env.ANTHROPIC_MODEL?.trim() || "claude-3-5-sonnet-20241022"
  );
}

/** Desactiva llamadas a Claude (solo heurísticas locales / anti-spam por tasa). */
export function skipComplaintModeration(): boolean {
  const v = process.env.SKIP_COMPLAINT_MODERATION?.toLowerCase();
  if (!v) {
    return true;
  }
  return v === "true" || v === "1" || v === "yes";
}
