/*
  Warnings:

  - You are about to drop the column `userId` on the `Ingredient` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[ingredientName,quantity,unit,department,expiration]` on the table `Ingredient` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "Ingredient" DROP CONSTRAINT "Ingredient_userId_fkey";

-- AlterTable
ALTER TABLE "Ingredient" DROP COLUMN "userId";

-- CreateTable
CREATE TABLE "_IngredientToUser" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_IngredientToUser_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_IngredientToUser_B_index" ON "_IngredientToUser"("B");

-- CreateIndex
CREATE UNIQUE INDEX "Ingredient_ingredientName_quantity_unit_department_expirati_key" ON "Ingredient"("ingredientName", "quantity", "unit", "department", "expiration");

-- AddForeignKey
ALTER TABLE "_IngredientToUser" ADD CONSTRAINT "_IngredientToUser_A_fkey" FOREIGN KEY ("A") REFERENCES "Ingredient"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_IngredientToUser" ADD CONSTRAINT "_IngredientToUser_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
