/*
  Warnings:

  - You are about to drop the `IngredientsOnHand` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "IngredientsOnHand" DROP CONSTRAINT "IngredientsOnHand_ingredientId_fkey";

-- DropForeignKey
ALTER TABLE "IngredientsOnHand" DROP CONSTRAINT "IngredientsOnHand_userId_fkey";

-- DropTable
DROP TABLE "IngredientsOnHand";

-- CreateTable
CREATE TABLE "OwnedIngredient" (
    "userId" INTEGER NOT NULL,
    "ingredientId" INTEGER NOT NULL,
    "quantity" INTEGER NOT NULL,
    "unit" TEXT NOT NULL,
    "expirationDate" TIMESTAMP(3)
);

-- CreateIndex
CREATE UNIQUE INDEX "OwnedIngredient_userId_ingredientId_key" ON "OwnedIngredient"("userId", "ingredientId");

-- AddForeignKey
ALTER TABLE "OwnedIngredient" ADD CONSTRAINT "OwnedIngredient_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OwnedIngredient" ADD CONSTRAINT "OwnedIngredient_ingredientId_fkey" FOREIGN KEY ("ingredientId") REFERENCES "Ingredient"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
