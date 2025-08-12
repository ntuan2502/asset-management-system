-- AlterTable
ALTER TABLE "public"."User" ADD COLUMN     "departmentId" TEXT,
ADD COLUMN     "officeId" TEXT;

-- CreateTable
CREATE TABLE "public"."Office" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "internationalName" TEXT NOT NULL,
    "shortName" TEXT NOT NULL,
    "taxCode" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Office_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Department" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "officeId" TEXT NOT NULL,

    CONSTRAINT "Department_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Office_internationalName_key" ON "public"."Office"("internationalName");

-- CreateIndex
CREATE UNIQUE INDEX "Office_shortName_key" ON "public"."Office"("shortName");

-- CreateIndex
CREATE UNIQUE INDEX "Office_taxCode_key" ON "public"."Office"("taxCode");

-- CreateIndex
CREATE UNIQUE INDEX "Department_name_officeId_key" ON "public"."Department"("name", "officeId");

-- AddForeignKey
ALTER TABLE "public"."User" ADD CONSTRAINT "User_officeId_fkey" FOREIGN KEY ("officeId") REFERENCES "public"."Office"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."User" ADD CONSTRAINT "User_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES "public"."Department"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Department" ADD CONSTRAINT "Department_officeId_fkey" FOREIGN KEY ("officeId") REFERENCES "public"."Office"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
