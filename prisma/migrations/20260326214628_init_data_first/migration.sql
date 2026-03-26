-- CreateTable
CREATE TABLE "Brand" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "normalizedName" TEXT NOT NULL,
    "displayName" TEXT NOT NULL,
    "lastWallRank" INTEGER,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Complaint" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "brandId" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "intensity" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "visitorHash" TEXT NOT NULL,
    "noise" BOOLEAN NOT NULL DEFAULT false,
    "reactionMeToo" INTEGER NOT NULL DEFAULT 0,
    "reactionIndignante" INTEGER NOT NULL DEFAULT 0,
    "sentimentScore" REAL,
    "sentimentLabel" TEXT,
    "topicsJson" TEXT,
    CONSTRAINT "Complaint_brandId_fkey" FOREIGN KEY ("brandId") REFERENCES "Brand" ("id") ON DELETE CASCADE ON UPDATE CASCADE
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
