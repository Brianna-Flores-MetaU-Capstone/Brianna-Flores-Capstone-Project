-- CreateTable
CREATE TABLE "_RecipeToUser" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_RecipeToUser_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_RecipeToUser_B_index" ON "_RecipeToUser"("B");

-- AddForeignKey
ALTER TABLE "_RecipeToUser" ADD CONSTRAINT "_RecipeToUser_A_fkey" FOREIGN KEY ("A") REFERENCES "Recipe"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_RecipeToUser" ADD CONSTRAINT "_RecipeToUser_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
