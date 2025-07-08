/*
  Warnings:

  - You are about to drop the column `diets` on the `Recipe` table. All the data in the column will be lost.
  - You are about to drop the column `intolerances` on the `Recipe` table. All the data in the column will be lost.
  - Added the required column `dairyFree` to the `Recipe` table without a default value. This is not possible if the table is not empty.
  - Added the required column `glutenFree` to the `Recipe` table without a default value. This is not possible if the table is not empty.
  - Added the required column `vegan` to the `Recipe` table without a default value. This is not possible if the table is not empty.
  - Added the required column `vegetarian` to the `Recipe` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Recipe" DROP COLUMN "diets",
DROP COLUMN "intolerances",
ADD COLUMN     "dairyFree" BOOLEAN NOT NULL,
ADD COLUMN     "glutenFree" BOOLEAN NOT NULL,
ADD COLUMN     "vegan" BOOLEAN NOT NULL,
ADD COLUMN     "vegetarian" BOOLEAN NOT NULL;
