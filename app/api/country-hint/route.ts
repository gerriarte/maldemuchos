import { NextResponse } from "next/server";
import { isValidLatamCountryCode } from "@/lib/domain/countries";

/**
 * Sugerencia de país para el formulario (LatAm).
 * Usa cabeceras de proxy/CDN cuando existen; si no, el cliente puede usar locale.
 */
export async function GET(request: Request) {
  const h = request.headers;
  const fromHeader =
    h.get("cf-ipcountry")?.trim().toUpperCase() ||
    h.get("x-vercel-ip-country")?.trim().toUpperCase() ||
    h.get("cloudfront-viewer-country")?.trim().toUpperCase() ||
    "";

  if (fromHeader && fromHeader !== "XX" && isValidLatamCountryCode(fromHeader)) {
    return NextResponse.json({ countryCode: fromHeader });
  }

  return NextResponse.json({ countryCode: null as string | null });
}
