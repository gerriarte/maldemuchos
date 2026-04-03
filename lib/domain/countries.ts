/**
 * Países admitidos (ISO 3166-1 alpha-2) para segmentar marcas multinacionales.
 * Lista completa para mostrar etiquetas de datos históricos.
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

/** Solo Latinoamérica y el Caribe hispano (formularios y nuevas publicaciones). */
export const LATAM_COUNTRY_OPTIONS: ReadonlyArray<{ code: string; label: string }> =
  COUNTRY_OPTIONS.filter(
    (c) =>
      !["ES", "US", "PT", "DE", "FR", "IT", "GB"].includes(c.code),
  );

const CODE_SET = new Set(COUNTRY_OPTIONS.map((c) => c.code));
const LATAM_CODE_SET = new Set(LATAM_COUNTRY_OPTIONS.map((c) => c.code));

export function isValidCountryCode(code: string): boolean {
  return CODE_SET.has(code.trim().toUpperCase());
}

export function isValidLatamCountryCode(code: string): boolean {
  return LATAM_CODE_SET.has(code.trim().toUpperCase());
}

export function countryLabel(code: string): string | undefined {
  const c = code.trim().toUpperCase();
  return COUNTRY_OPTIONS.find((x) => x.code === c)?.label;
}

/**
 * Deduce país desde locale del navegador (es-AR → AR).
 * Solo devuelve códigos LatAm; si no coincide, AR.
 */
export function guessCountryFromLocale(locale: string | undefined): string {
  if (!locale || typeof locale !== "string") return "AR";
  const m = /^[a-z]{2}-([A-Z]{2})/i.exec(locale.trim());
  if (m?.[1] && isValidLatamCountryCode(m[1])) return m[1].toUpperCase();
  return "AR";
}
