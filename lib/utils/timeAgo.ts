export function timeAgoEs(iso: string): string {
  const t = new Date(iso).getTime();
  const diff = Date.now() - t;
  if (diff < 60_000) return "hace un momento";
  if (diff < 3_600_000) {
    const m = Math.floor(diff / 60_000);
    return m === 1 ? "hace 1 minuto" : `hace ${m} minutos`;
  }
  if (diff < 86_400_000) {
    const h = Math.floor(diff / 3_600_000);
    return h === 1 ? "hace 1 hora" : `hace ${h} horas`;
  }
  const d = Math.floor(diff / 86_400_000);
  return d === 1 ? "hace 1 día" : `hace ${d} días`;
}
