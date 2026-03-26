/**
 * Países admitidos (ISO 3166-1 alpha-2) para segmentar marcas multinacionales.
 * Orden: prioridad LatAm + España; incluye mercados frecuentes.
 */
export const COUNTRY_OPTIONS: ReadonlyArray<{ code: string; label: string }> = [
  { code: "AR", label: "Argentina" },
  { code: "BO", label: "Bolivia" },
  { code: "BR", label: "Brasil" },
  { code: "CL", label: "Chile" },
  { code: "CO", label: "Colombia" },
  { code: "CR", label: "Costa Rica" },
  { code: "CU", label: "Cuba" },
  { code: "DO", label: "Rep. Dominicana" },
  { code: "EC", label: "Ecuador" },
  { code: "SV", label: "El Salvador" },
  { code: "ES", label: "España" },
  { code: "US", label: "Estados Unidos" },
  { code: "GT", label: "Guatemala" },
  { code: "HN", label: "Honduras" },
  { code: "MX", label: "México" },
  { code: "NI", label: "Nicaragua" },
  { code: "PA", label: "Panamá" },
  { code: "PY", label: "Paraguay" },
  { code: "PE", label: "Perú" },
  { code: "PT", label: "Portugal" },
  { code: "PR", label: "Puerto Rico" },
  { code: "UY", label: "Uruguay" },
  { code: "VE", label: "Venezuela" },
  { code: "DE", label: "Alemania" },
  { code: "FR", label: "Francia" },
  { code: "IT", label: "Italia" },
  { code: "GB", label: "Reino Unido" },
];

const CODE_SET = new Set(COUNTRY_OPTIONS.map((c) => c.code));

export function isValidCountryCode(code: string): boolean {
  return CODE_SET.has(code.trim().toUpperCase());
}

export function countryLabel(code: string): string | undefined {
  const c = code.trim().toUpperCase();
  return COUNTRY_OPTIONS.find((x) => x.code === c)?.label;
}

/** Intenta deducir país desde locale del navegador (es-AR → AR). */
export function guessCountryFromLocale(locale: string | undefined): string {
  if (!locale || typeof locale !== "string") return "AR";
  const m = /^[a-z]{2}-([A-Z]{2})/i.exec(locale.trim());
  if (m?.[1] && isValidCountryCode(m[1])) return m[1].toUpperCase();
  return "AR";
}
