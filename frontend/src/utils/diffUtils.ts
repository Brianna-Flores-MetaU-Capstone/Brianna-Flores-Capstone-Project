import type { GPRecipeDataTypes, GPIngredientDataTypes } from "./types";
const databaseUrl = import.meta.env.VITE_DATABASE_URL;
import axios from "axios";
import { axiosConfig } from "../utils/databaseHelpers";

type GPDiffType = {
  recipeA: GPRecipeDataTypes;
  recipeB: GPRecipeDataTypes;
};
const getDiffResults = ({ recipeA, recipeB }: GPDiffType) => {
    const ingredientsDiff = getIngredientsDiff({recipeIngredientsA: recipeA.ingredients, recipeIngredientsB: recipeB.ingredients})
};


type GPIngredientDiffType = {
    recipeIngredientsA: GPIngredientDataTypes[];
    recipeIngredientsB: GPIngredientDataTypes[]
}
type GPQuantityChangeType = {
    recipeIngredientA: GPIngredientDataTypes
    recipeIngredientB: GPIngredientDataTypes
}
const getIngredientsDiff = async ({recipeIngredientsA, recipeIngredientsB}: GPIngredientDiffType) => {
    let added: GPIngredientDataTypes[] = []
    let changed: GPQuantityChangeType[] = []
    let deleted: GPIngredientDataTypes[] = []
    let unchanged: GPIngredientDataTypes[] = []
    let ingredientsAMap = new Map(recipeIngredientsA.map((ingredient) => [ingredient.ingredientName, ingredient]));
    let ingredientsBMap = new Map(recipeIngredientsB.map((ingredient) => [ingredient.ingredientName, ingredient]));
    
    for (const ingredientA of recipeIngredientsA) {
        // iterate through ingredients in A
        if (!ingredientsBMap.has(ingredientA.ingredientName)) {
            // ingredient found in recipe A but not in B
            deleted = [...deleted, ingredientA]
        } else {
            const ingredientB = ingredientsBMap.get(ingredientA.ingredientName)
            if (ingredientB && ingredientB.quantity === ingredientA.quantity) {
                // ingredient found in B and same quantity w/o conversion
                unchanged = [...unchanged, ingredientA]
            } else if (ingredientB !== undefined) {
                // otherwise check if same quantity with unit conversion
                const convertedUnits = await axios.post(`${databaseUrl}/recipes/convertUnits`, { convertTo: ingredientA, converting: ingredientB }, axiosConfig)
                if (ingredientA.quantity === convertedUnits.data.converted.quantity) {
                    // quantity is the same, just had to convert units
                    unchanged = [...unchanged, ingredientA]
                } else {
                    // different quantities
                    changed = [...changed, {recipeIngredientA: ingredientA, recipeIngredientB: ingredientB}]
                }
            }
        }
    }
    for (const ingredientB of recipeIngredientsB) {
        if (!ingredientsAMap.has(ingredientB.ingredientName)) {
            added = [...added, ingredientB]
        }
    }
    const diffRecipeIngredients = {
        added: added,
        deleted: deleted,
        changed: changed,
        unchanged: unchanged
    }
    return diffRecipeIngredients
}

export { getDiffResults };
