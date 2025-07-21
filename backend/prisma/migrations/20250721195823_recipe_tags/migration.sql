-- AlterTable
ALTER TABLE "Recipe" ADD COLUMN     "recipeTags" TEXT[] DEFAULT ARRAY[]::TEXT[];
