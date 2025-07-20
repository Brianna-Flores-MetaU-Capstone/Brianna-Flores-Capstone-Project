/*
  Warnings:

  - You are about to drop the column `editingAuthorIds` on the `Recipe` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Recipe" DROP CONSTRAINT "Recipe_editingAuthorIds_fkey";

-- AlterTable
ALTER TABLE "Recipe" DROP COLUMN "editingAuthorIds",
ADD COLUMN     "editingAuthorId" INTEGER;

-- AddForeignKey
ALTER TABLE "Recipe" ADD CONSTRAINT "Recipe_editingAuthorId_fkey" FOREIGN KEY ("editingAuthorId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
