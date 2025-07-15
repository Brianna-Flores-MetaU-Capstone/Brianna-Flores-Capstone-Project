/*
  Warnings:

  - You are about to drop the column `userId` on the `GroceryList` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "GroceryList" DROP CONSTRAINT "GroceryList_userId_fkey";

-- DropForeignKey
ALTER TABLE "Ingredient" DROP CONSTRAINT "Ingredient_groceryListId_fkey";

-- DropIndex
DROP INDEX "GroceryList_userId_key";

-- AlterTable
ALTER TABLE "GroceryList" DROP COLUMN "userId";
