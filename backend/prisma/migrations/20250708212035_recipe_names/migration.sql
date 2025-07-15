/*
  Warnings:

  - You are about to drop the column `ingredientsNeeded` on the `Recipe` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Recipe" DROP COLUMN "ingredientsNeeded",
ADD COLUMN     "ingredients" TEXT[];
