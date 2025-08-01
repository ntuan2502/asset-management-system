-- CreateTable
CREATE TABLE "public"."Snapshot" (
    "id" TEXT NOT NULL,
    "aggregateId" TEXT NOT NULL,
    "aggregateType" TEXT NOT NULL,
    "version" INTEGER NOT NULL,
    "payload" JSONB NOT NULL,

    CONSTRAINT "Snapshot_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Snapshot_aggregateId_idx" ON "public"."Snapshot"("aggregateId");

-- CreateIndex
CREATE UNIQUE INDEX "Snapshot_aggregateId_version_key" ON "public"."Snapshot"("aggregateId", "version");
