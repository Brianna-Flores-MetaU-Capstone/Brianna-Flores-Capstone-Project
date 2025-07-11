/*
  Warnings:

  - You are about to drop the column `estimatedCost` on the `Ingredient` table. All the data in the column will be lost.
  - You are about to drop the column `estimatedCostPerUnit` on the `Ingredient` table. All the data in the column will be lost.
  - You are about to drop the column `groceryListCost` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Ingredient" DROP COLUMN "estimatedCost",
DROP COLUMN "estimatedCostPerUnit";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "groceryListCost",
ADD COLUMN     "groceryListPrice" DECIMAL(65,30) NOT NULL DEFAULT 0.00;
