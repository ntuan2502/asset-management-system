-- Migration script to enhance the "User" model in the database.
-- This script adds new columns to the "User" table and modifies existing ones.

-- Step 1: Add the new 'password' column to the "User" table, with a temporary default value for existing rows.
-- We use a placeholder value that is clearly not a real password.
ALTER TABLE "User" ADD COLUMN "password" TEXT NOT NULL DEFAULT 'needs_to_be_updated';

-- Step 2: Add the other new nullable columns. This is safe because they can be NULL.
ALTER TABLE "User" ADD COLUMN "dob" TIMESTAMP(3),
ADD COLUMN "gender" TEXT,
ADD COLUMN "deletedAt" TIMESTAMP(3);

-- Step 3: Now that all existing rows have a value for 'password', we can remove the default constraint.
-- This ensures that any NEW user created from now on MUST have a password provided explicitly.
ALTER TABLE "User" ALTER COLUMN "password" DROP DEFAULT;

-- Step 4: Create the 'Gender' enum type used by the 'gender' column.
-- Note: The specific syntax for enums can vary between databases. This is for PostgreSQL.
CREATE TYPE "Gender" AS ENUM ('MALE', 'FEMALE', 'OTHER');

-- Step 5: Update the 'gender' column to use the new enum type.
-- We first change it to integer using a mapping, then change the type. This is a common pattern for type changes.
ALTER TABLE "User" ALTER COLUMN "gender" SET DATA TYPE "Gender" USING "gender"::text::"Gender";