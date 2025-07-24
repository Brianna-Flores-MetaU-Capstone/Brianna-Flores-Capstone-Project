/*
  Warnings:

  - The `previewImage` column on the `Recipe` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Recipe" DROP COLUMN "previewImage",
ADD COLUMN     "previewImage" TEXT[] DEFAULT ARRAY['']::TEXT[];
