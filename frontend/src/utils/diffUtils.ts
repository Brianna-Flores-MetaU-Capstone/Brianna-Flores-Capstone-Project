import type { GPRecipeDataTypes } from "./types";
import { RecipeIngredientsDiff } from "../classes/DiffClass";

type GPDiffType = {
  recipeA: GPRecipeDataTypes;
  recipeB: GPRecipeDataTypes;
};
const getDiffResults = ({ recipeA, recipeB }: GPDiffType) => {
    const ingredientsDiff = new RecipeIngredientsDiff()
    const ingredientsDiffResults = ingredientsDiff.getDiff(recipeA.ingredients, recipeB.ingredients)
    return ingredientsDiffResults
};

export { getDiffResults };
