/*
  Warnings:

  - A unique constraint covering the columns `[slug]` on the table `League` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `slug` to the `League` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "League" ADD COLUMN "slug" TEXT;

-- Update existing leagues with generated slugs
UPDATE "League" SET "slug" = LOWER(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE("name", ' ', '-'), 'á', 'a'), 'é', 'e'), 'í', 'i'), 'ó', 'o')) WHERE "slug" IS NULL;

-- Make slug NOT NULL
ALTER TABLE "League" ALTER COLUMN "slug" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "League_slug_key" ON "League"("slug");
