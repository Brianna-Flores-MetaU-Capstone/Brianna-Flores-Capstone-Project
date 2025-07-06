/*
  Warnings:

  - Made the column `department` on table `Ingredient` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Ingredient" ALTER COLUMN "estimatedCostPerUnit" DROP NOT NULL,
ALTER COLUMN "department" SET NOT NULL;
