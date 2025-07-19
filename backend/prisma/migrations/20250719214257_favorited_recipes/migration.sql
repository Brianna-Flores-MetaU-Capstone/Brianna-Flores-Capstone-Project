/*
  Warnings:

  - You are about to drop the `_RecipeToUser` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_RecipeToUser" DROP CONSTRAINT "_RecipeToUser_A_fkey";

-- DropForeignKey
ALTER TABLE "_RecipeToUser" DROP CONSTRAINT "_RecipeToUser_B_fkey";

-- DropTable
DROP TABLE "_RecipeToUser";

-- CreateTable
CREATE TABLE "_PlannedRecipes" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_PlannedRecipes_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_FavoritedRecipes" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_FavoritedRecipes_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_PlannedRecipes_B_index" ON "_PlannedRecipes"("B");

-- CreateIndex
CREATE INDEX "_FavoritedRecipes_B_index" ON "_FavoritedRecipes"("B");

-- AddForeignKey
ALTER TABLE "_PlannedRecipes" ADD CONSTRAINT "_PlannedRecipes_A_fkey" FOREIGN KEY ("A") REFERENCES "Recipe"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PlannedRecipes" ADD CONSTRAINT "_PlannedRecipes_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_FavoritedRecipes" ADD CONSTRAINT "_FavoritedRecipes_A_fkey" FOREIGN KEY ("A") REFERENCES "Recipe"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_FavoritedRecipes" ADD CONSTRAINT "_FavoritedRecipes_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
