/*
  Warnings:

  - You are about to drop the column `editingAuthor` on the `Recipe` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Recipe" DROP COLUMN "editingAuthor",
ADD COLUMN     "editingAuthorId" INTEGER,
ADD COLUMN     "editingAuthorName" TEXT NOT NULL DEFAULT '';

-- AddForeignKey
ALTER TABLE "Recipe" ADD CONSTRAINT "Recipe_editingAuthorId_fkey" FOREIGN KEY ("editingAuthorId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
