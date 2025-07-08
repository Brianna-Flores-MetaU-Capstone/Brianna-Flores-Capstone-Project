/*
  Warnings:

  - You are about to drop the column `expirationDate` on the `Ingredient` table. All the data in the column will be lost.
  - You are about to drop the column `quantity` on the `Ingredient` table. All the data in the column will be lost.
  - You are about to drop the column `unit` on the `Ingredient` table. All the data in the column will be lost.
  - Added the required column `quantity` to the `IngredientsOnHand` table without a default value. This is not possible if the table is not empty.
  - Added the required column `unit` to the `IngredientsOnHand` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Ingredient_ingredientName_quantity_unit_department_expirati_key";

-- AlterTable
ALTER TABLE "Ingredient" DROP COLUMN "expirationDate",
DROP COLUMN "quantity",
DROP COLUMN "unit";

-- AlterTable
ALTER TABLE "IngredientsOnHand" ADD COLUMN     "expirationDate" TEXT,
ADD COLUMN     "quantity" INTEGER NOT NULL,
ADD COLUMN     "unit" TEXT NOT NULL;
