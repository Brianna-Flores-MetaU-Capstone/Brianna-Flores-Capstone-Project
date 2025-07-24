/*
  Warnings:

  - A unique constraint covering the columns `[apiId,editingAuthorId]` on the table `Recipe` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Recipe_apiId_editingAuthorName_key";

-- CreateIndex
CREATE UNIQUE INDEX "Recipe_apiId_editingAuthorId_key" ON "Recipe"("apiId", "editingAuthorId");
