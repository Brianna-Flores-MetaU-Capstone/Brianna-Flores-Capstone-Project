import type { GPIngredientDataTypes, GPRecipeDataTypes } from "./types";
import { RecipeIngredientsDiff } from "../classes/DiffClass";
import type { GPDiffReturnType } from "../classes/DiffClass";


type GPRecipeDiffType = {
  recipeA: GPRecipeDataTypes
  recipeB: GPRecipeDataTypes
  servingsDiff: boolean
  recipeIngredientDiff: GPDiffReturnType<GPIngredientDataTypes>
  purchasedIngredientsDiff: GPDiffReturnType<GPIngredientDataTypes>
}
type GPDiffType = {
  recipeA: GPRecipeDataTypes;
  recipeB: GPRecipeDataTypes;
};
const getRecipeDiffResults = ({ recipeA, recipeB }: GPDiffType) => {
  const diffRecipeIngredients = new RecipeIngredientsDiff();
  const diffRecipeIngredientsResults = diffRecipeIngredients.getDiff(
    recipeA.ingredients,
    recipeB.ingredients
  );
  const diffIngredientsToPurchase = new RecipeIngredientsDiff();
  const diffIngredientsToPurchaseResults = diffIngredientsToPurchase.getDiff(
    recipeA.ingredientCostInfo,
    recipeB.ingredientCostInfo
  );
  const diffServingsResults = recipeA.servings !== recipeB.servings
  const recipeDiffResults: GPRecipeDiffType = {
    recipeA,
    recipeB,
    servingsDiff: diffServingsResults,
    recipeIngredientDiff: diffRecipeIngredientsResults,
    purchasedIngredientsDiff: diffIngredientsToPurchaseResults
  }
  return recipeDiffResults
};

export { getRecipeDiffResults };
export type { GPRecipeDiffType }
