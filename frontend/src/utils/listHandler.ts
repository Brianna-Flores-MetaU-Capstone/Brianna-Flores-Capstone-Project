import type { GPIngredientDataTypes, GPRecipeDataTypes } from "./types"

type GPCreateGroceryListType = {
    selectedRecipes: GPRecipeDataTypes[]
    ingredientsOnHand: GPIngredientDataTypes[]
}

const createGroceryList = ({selectedRecipes, ingredientsOnHand}: GPCreateGroceryListType) => {
    const groceriesToBuy = [];
    const groceriesOnHand = selectedRecipes.map((recipe) => {
        return (
            recipe.ingredients.map((ingredient => !ingredientsOnHand.includes(ingredient)))
        )
    })
    console.log(groceriesOnHand)
}

export { createGroceryList }