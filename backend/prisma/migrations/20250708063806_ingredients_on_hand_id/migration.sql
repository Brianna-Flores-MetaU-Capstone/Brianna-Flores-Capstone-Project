/*
  Warnings:

  - The primary key for the `IngredientsOnHand` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `IngredientsOnHand` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "IngredientsOnHand" DROP CONSTRAINT "IngredientsOnHand_pkey",
DROP COLUMN "id",
ADD CONSTRAINT "IngredientsOnHand_pkey" PRIMARY KEY ("userId", "ingredientId");
