/*
  Warnings:

  - You are about to drop the column `expiration` on the `Ingredient` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[ingredientName,quantity,unit,department,expirationDate]` on the table `Ingredient` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Ingredient_ingredientName_quantity_unit_department_expirati_key";

-- AlterTable
ALTER TABLE "Ingredient" DROP COLUMN "expiration",
ADD COLUMN     "expirationDate" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Ingredient_ingredientName_quantity_unit_department_expirati_key" ON "Ingredient"("ingredientName", "quantity", "unit", "department", "expirationDate");
