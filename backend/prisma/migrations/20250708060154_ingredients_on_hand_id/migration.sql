/*
  Warnings:

  - The primary key for the `IngredientsOnHand` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- AlterTable
ALTER TABLE "IngredientsOnHand" DROP CONSTRAINT "IngredientsOnHand_pkey",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "IngredientsOnHand_pkey" PRIMARY KEY ("id");
