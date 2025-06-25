-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Ingredient" (
    "id" SERIAL NOT NULL,
    "ingredientName" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "unit" TEXT NOT NULL,
    "estimatedCostPerUnit" DECIMAL(65,30) NOT NULL,
    "department" TEXT,
    "productImage" TEXT,
    "expiration" TIMESTAMP(3),
    "estimatedCost" DECIMAL(65,30),
    "userId" INTEGER NOT NULL,
    "groceryListId" INTEGER,
    "recipeId" INTEGER NOT NULL,

    CONSTRAINT "Ingredient_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Recipe" (
    "id" SERIAL NOT NULL,
    "recipeTitle" TEXT NOT NULL,
    "previewImage" TEXT,
    "servings" INTEGER NOT NULL,
    "sourceUrl" TEXT NOT NULL,
    "totalCost" DECIMAL(65,30) NOT NULL,
    "instructions" TEXT[],
    "containsDairy" BOOLEAN,
    "containsPeanuts" BOOLEAN,
    "containsSoy" BOOLEAN,
    "containsEgg" BOOLEAN,
    "containsSeafood" BOOLEAN,
    "containsSulfite" BOOLEAN,
    "containsGluten" BOOLEAN,
    "containsSesame" BOOLEAN,
    "containsTreeNut" BOOLEAN,
    "containsGrain" BOOLEAN,
    "containsShellfish" BOOLEAN,
    "containsWheat" BOOLEAN,
    "isVegetarian" BOOLEAN NOT NULL,
    "isVegan" BOOLEAN NOT NULL,

    CONSTRAINT "Recipe_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GroceryList" (
    "id" SERIAL NOT NULL,
    "listName" TEXT NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "GroceryList_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "GroceryList_userId_key" ON "GroceryList"("userId");

-- AddForeignKey
ALTER TABLE "Ingredient" ADD CONSTRAINT "Ingredient_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ingredient" ADD CONSTRAINT "Ingredient_groceryListId_fkey" FOREIGN KEY ("groceryListId") REFERENCES "GroceryList"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ingredient" ADD CONSTRAINT "Ingredient_recipeId_fkey" FOREIGN KEY ("recipeId") REFERENCES "Recipe"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GroceryList" ADD CONSTRAINT "GroceryList_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
