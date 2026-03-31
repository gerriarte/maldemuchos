-- Ensure UUID generation is available on PostgreSQL
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- CreateTable
CREATE TABLE "Brand" (
    "id" TEXT NOT NULL DEFAULT gen_random_uuid()::text,
    "normalizedName" TEXT NOT NULL,
    "displayName" TEXT NOT NULL,
    "lastWallRank" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "Brand_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Complaint" (
    "id" TEXT NOT NULL DEFAULT gen_random_uuid()::text,
    "brandId" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "intensity" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "visitorHash" TEXT NOT NULL,
    "noise" BOOLEAN NOT NULL DEFAULT false,
    "reactionMeToo" INTEGER NOT NULL DEFAULT 0,
    "reactionIndignante" INTEGER NOT NULL DEFAULT 0,
    "sentimentScore" DOUBLE PRECISION,
    "sentimentLabel" TEXT,
    "topicsJson" TEXT,
    CONSTRAINT "Complaint_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Brand_normalizedName_key" ON "Brand"("normalizedName");

-- CreateIndex
CREATE INDEX "Brand_normalizedName_idx" ON "Brand"("normalizedName");

-- CreateIndex
CREATE INDEX "Complaint_createdAt_idx" ON "Complaint"("createdAt");

-- CreateIndex
CREATE INDEX "Complaint_brandId_idx" ON "Complaint"("brandId");

-- CreateIndex
CREATE INDEX "Complaint_noise_idx" ON "Complaint"("noise");

-- CreateIndex
CREATE INDEX "Complaint_visitorHash_idx" ON "Complaint"("visitorHash");

-- AddForeignKey
ALTER TABLE "Complaint"
ADD CONSTRAINT "Complaint_brandId_fkey"
FOREIGN KEY ("brandId") REFERENCES "Brand"("id")
ON DELETE CASCADE
ON UPDATE CASCADE;
