/*
  Warnings:

  - You are about to drop the column `recipeId` on the `Ingredient` table. All the data in the column will be lost.
  - You are about to drop the column `containsDairy` on the `Recipe` table. All the data in the column will be lost.
  - You are about to drop the column `containsEgg` on the `Recipe` table. All the data in the column will be lost.
  - You are about to drop the column `containsGluten` on the `Recipe` table. All the data in the column will be lost.
  - You are about to drop the column `containsGrain` on the `Recipe` table. All the data in the column will be lost.
  - You are about to drop the column `containsPeanuts` on the `Recipe` table. All the data in the column will be lost.
  - You are about to drop the column `containsSeafood` on the `Recipe` table. All the data in the column will be lost.
  - You are about to drop the column `containsSesame` on the `Recipe` table. All the data in the column will be lost.
  - You are about to drop the column `containsShellfish` on the `Recipe` table. All the data in the column will be lost.
  - You are about to drop the column `containsSoy` on the `Recipe` table. All the data in the column will be lost.
  - You are about to drop the column `containsSulfite` on the `Recipe` table. All the data in the column will be lost.
  - You are about to drop the column `containsTreeNut` on the `Recipe` table. All the data in the column will be lost.
  - You are about to drop the column `containsWheat` on the `Recipe` table. All the data in the column will be lost.
  - You are about to drop the column `isVegan` on the `Recipe` table. All the data in the column will be lost.
  - You are about to drop the column `isVegetarian` on the `Recipe` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[apiId]` on the table `Recipe` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `apiId` to the `Recipe` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Ingredient" DROP CONSTRAINT "Ingredient_recipeId_fkey";

-- AlterTable
ALTER TABLE "Ingredient" DROP COLUMN "recipeId";

-- AlterTable
ALTER TABLE "Recipe" DROP COLUMN "containsDairy",
DROP COLUMN "containsEgg",
DROP COLUMN "containsGluten",
DROP COLUMN "containsGrain",
DROP COLUMN "containsPeanuts",
DROP COLUMN "containsSeafood",
DROP COLUMN "containsSesame",
DROP COLUMN "containsShellfish",
DROP COLUMN "containsSoy",
DROP COLUMN "containsSulfite",
DROP COLUMN "containsTreeNut",
DROP COLUMN "containsWheat",
DROP COLUMN "isVegan",
DROP COLUMN "isVegetarian",
ADD COLUMN     "apiId" INTEGER NOT NULL,
ADD COLUMN     "diets" TEXT[],
ADD COLUMN     "ingredientsNeeded" TEXT[],
ADD COLUMN     "intolerances" TEXT[];

-- CreateIndex
CREATE UNIQUE INDEX "Recipe_apiId_key" ON "Recipe"("apiId");
