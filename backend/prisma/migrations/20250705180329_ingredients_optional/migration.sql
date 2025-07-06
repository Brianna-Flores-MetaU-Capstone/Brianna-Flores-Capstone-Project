/*
  Warnings:

  - You are about to drop the `_IngredientToUser` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Ingredient" DROP CONSTRAINT "Ingredient_recipeId_fkey";

-- DropForeignKey
ALTER TABLE "_IngredientToUser" DROP CONSTRAINT "_IngredientToUser_A_fkey";

-- DropForeignKey
ALTER TABLE "_IngredientToUser" DROP CONSTRAINT "_IngredientToUser_B_fkey";

-- AlterTable
ALTER TABLE "Ingredient" ALTER COLUMN "recipeId" DROP NOT NULL;

-- DropTable
DROP TABLE "_IngredientToUser";

-- AddForeignKey
ALTER TABLE "Ingredient" ADD CONSTRAINT "Ingredient_recipeId_fkey" FOREIGN KEY ("recipeId") REFERENCES "Recipe"("id") ON DELETE SET NULL ON UPDATE CASCADE;
