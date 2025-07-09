/*
  Warnings:

  - You are about to drop the column `groceryListId` on the `Ingredient` table. All the data in the column will be lost.
  - You are about to drop the `GroceryList` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `groceryList` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Ingredient" DROP COLUMN "groceryListId";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "groceryList" JSONB NOT NULL;

-- DropTable
DROP TABLE "GroceryList";
