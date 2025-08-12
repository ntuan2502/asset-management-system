-- DropIndex
DROP INDEX "public"."Office_internationalName_key";

-- DropIndex
DROP INDEX "public"."Office_shortName_key";

-- DropIndex
DROP INDEX "public"."Office_taxCode_key";

-- CreateIndex
CREATE INDEX "Office_internationalName_idx" ON "public"."Office"("internationalName");

-- CreateIndex
CREATE INDEX "Office_shortName_idx" ON "public"."Office"("shortName");

-- CreateIndex
CREATE INDEX "Office_taxCode_idx" ON "public"."Office"("taxCode");
