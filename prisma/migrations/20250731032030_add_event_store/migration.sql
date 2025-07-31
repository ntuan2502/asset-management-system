-- CreateTable
CREATE TABLE "public"."Event" (
    "id" TEXT NOT NULL,
    "aggregateId" TEXT NOT NULL,
    "aggregateType" TEXT NOT NULL,
    "eventType" TEXT NOT NULL,
    "payload" JSONB NOT NULL,
    "version" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Event_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Event_aggregateId_idx" ON "public"."Event"("aggregateId");

-- CreateIndex
CREATE UNIQUE INDEX "Event_aggregateId_version_key" ON "public"."Event"("aggregateId", "version");
