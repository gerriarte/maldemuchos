/** Ventana temporal para detectar patrones de spam (ms). Default: 10 min. */
export function spamWindowMs(): number {
  const n = Number(process.env.SPAM_WINDOW_MS);
  return Number.isFinite(n) && n > 0 ? n : 600_000;
}

/** Máximo de publicaciones en la ventana antes de marcar ruido. */
export function spamMaxPostsPerWindow(): number {
  const n = Number(process.env.SPAM_MAX_POSTS_PER_WINDOW);
  return Number.isFinite(n) && n > 0 ? n : 25;
}

/** Máximo de marcas distintas en la ventana (ej. “quemar 50 empresas”). */
export function spamMaxDistinctCompaniesPerWindow(): number {
  const n = Number(process.env.SPAM_MAX_DISTINCT_COMPANIES);
  return Number.isFinite(n) && n > 0 ? n : 50;
}
