/*
  Warnings:

  - The primary key for the `IngredientsOnHand` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - A unique constraint covering the columns `[userId,ingredientId]` on the table `IngredientsOnHand` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "IngredientsOnHand" DROP CONSTRAINT "IngredientsOnHand_pkey";

-- CreateIndex
CREATE UNIQUE INDEX "IngredientsOnHand_userId_ingredientId_key" ON "IngredientsOnHand"("userId", "ingredientId");
