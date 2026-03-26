import { AnalyticsUnauthorizedError } from "@/lib/domain/errors";

/**
 * Si ANALYTICS_API_SECRET está definido, exige `Authorization: Bearer <secret>`.
 * Si no está definido (dev), permite acceso sin auth.
 */
export function assertAnalyticsAuthorized(request: Request): void {
  const secret = process.env.ANALYTICS_API_SECRET;
  if (!secret?.trim()) {
    return;
  }
  const auth = request.headers.get("authorization");
  if (auth !== `Bearer ${secret}`) {
    throw new AnalyticsUnauthorizedError();
  }
}
