import type { recipeType, ingredientType } from "./types"

const parseRecipeData = (recipeData: any) => {
    return recipeData.map((recipe: any) => ({
        id: recipe.id,
        image: recipe.image,
        title: recipe.title,
        servings: recipe.servings,
        sourceUrl: recipe.sourceUrl,
        vegetarian: recipe.vegetarian,
        vegan: recipe.vegan,
        glutenFree: recipe.glutenFree,
        dairyFree: recipe.dairyFree,
        ingredients: parseIngredients(recipe.extendedIngredients),
        totalEstimatedCost: estimateTotalCost(recipe.ingredients)
    }))
}

const parseIngredients = (ingredientsData: any) => {
    return ingredientsData.map((ingredient: any) => ({
        department: ingredient.aisle,
        image: ingredient.image,
        name: ingredient.name,
        amount: ingredient.amount,
        unit: ingredient.unit,
        estimatedCost: getIngredientCost(ingredient.name)
    }))
}

const getIngredientCost = (ingredientName: string) => {
    return 0;
}

const estimateTotalCost = (ingredients: ingredientType) => {
    return 0;
}

export {parseRecipeData}