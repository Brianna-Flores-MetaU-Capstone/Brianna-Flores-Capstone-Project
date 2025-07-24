/*
  Warnings:

  - You are about to drop the column `editingAuthorId` on the `Recipe` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Recipe" DROP CONSTRAINT "Recipe_editingAuthorId_fkey";

-- AlterTable
ALTER TABLE "Recipe" DROP COLUMN "editingAuthorId",
ADD COLUMN     "editingAuthorIds" INTEGER NOT NULL DEFAULT -1;

-- AddForeignKey
ALTER TABLE "Recipe" ADD CONSTRAINT "Recipe_editingAuthorIds_fkey" FOREIGN KEY ("editingAuthorIds") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
