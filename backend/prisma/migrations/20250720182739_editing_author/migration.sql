-- DropIndex
DROP INDEX "Recipe_apiId_key";

-- AlterTable
ALTER TABLE "Recipe" ALTER COLUMN "editingAuthorName" DROP DEFAULT;
