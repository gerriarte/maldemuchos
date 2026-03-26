-- Redefinir marca como (nombre normalizado + país) para multinacionales.

-- SQLite: agregar columna con default para filas existentes
ALTER TABLE "Brand" ADD COLUMN "countryCode" TEXT NOT NULL DEFAULT 'AR';

DROP INDEX "Brand_normalizedName_key";

CREATE UNIQUE INDEX "Brand_normalizedName_countryCode_key" ON "Brand"("normalizedName", "countryCode");

CREATE INDEX "Brand_countryCode_idx" ON "Brand"("countryCode");
