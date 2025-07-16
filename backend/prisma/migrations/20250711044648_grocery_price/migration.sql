/*
  Warnings:

  - You are about to drop the column `groceryListPrice` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "groceryListPrice",
ADD COLUMN     "groceryListCost" DECIMAL(65,30) NOT NULL DEFAULT 0.00;
