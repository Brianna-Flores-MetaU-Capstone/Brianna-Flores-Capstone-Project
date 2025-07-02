/*
  Warnings:

  - You are about to drop the column `intollerances` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "intollerances",
ADD COLUMN     "intolerances" TEXT[];
