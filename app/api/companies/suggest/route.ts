import { NextResponse } from "next/server";
import { isValidLatamCountryCode } from "@/lib/domain/countries";
import { suggestCompanies } from "@/lib/repositories/complaintRepository";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q") ?? "";
  const country = (searchParams.get("country") ?? "AR").trim().toUpperCase();
  if (!isValidLatamCountryCode(country)) {
    return NextResponse.json({ error: "country_invalid" }, { status: 400 });
  }
  const items = await suggestCompanies(q, 12, country);
  return NextResponse.json({ items });
}
