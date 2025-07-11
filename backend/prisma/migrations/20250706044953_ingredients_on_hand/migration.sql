-- CreateTable
CREATE TABLE "IngredientsOnHand" (
    "userId" INTEGER NOT NULL,
    "ingredientId" INTEGER NOT NULL,

    CONSTRAINT "IngredientsOnHand_pkey" PRIMARY KEY ("userId","ingredientId")
);

-- AddForeignKey
ALTER TABLE "IngredientsOnHand" ADD CONSTRAINT "IngredientsOnHand_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "IngredientsOnHand" ADD CONSTRAINT "IngredientsOnHand_ingredientId_fkey" FOREIGN KEY ("ingredientId") REFERENCES "Ingredient"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
