/*
  Warnings:

  - The `apiId` column on the `Recipe` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Recipe" DROP COLUMN "apiId",
ADD COLUMN     "apiId" INTEGER NOT NULL DEFAULT 0;

-- CreateIndex
CREATE UNIQUE INDEX "Recipe_apiId_editingAuthorId_key" ON "Recipe"("apiId", "editingAuthorId");
