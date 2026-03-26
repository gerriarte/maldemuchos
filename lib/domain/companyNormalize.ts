/**
 * Clave estable para deduplicar marcas (minúsculas, espacios colapsados).
 */
export function normalizeCompanyName(name: string): string {
  return name
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ");
}
