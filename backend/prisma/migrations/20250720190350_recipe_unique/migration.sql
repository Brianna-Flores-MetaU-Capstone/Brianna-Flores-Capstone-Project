/*
  Warnings:

  - A unique constraint covering the columns `[apiId,editingAuthorName]` on the table `Recipe` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Recipe_apiId_editingAuthorName_key" ON "Recipe"("apiId", "editingAuthorName");
