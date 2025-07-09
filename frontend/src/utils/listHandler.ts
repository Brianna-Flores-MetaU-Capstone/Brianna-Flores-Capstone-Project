import type { GPIngredientDataTypes, GPRecipeDataTypes } from "./types"

type GPCreateGroceryListType = {
    selectedRecipes: GPRecipeDataTypes[]
    ingredientsOnHand: GPIngredientDataTypes[]
}

const createGroceryList = ({selectedRecipes, ingredientsOnHand}: GPCreateGroceryListType) => {
    const selectedRecipe = selectedRecipes
    const ingredients = ingredientsOnHand
}

export { createGroceryList }