import type { GPRecipeComparisonReturnType } from "../classes/recipeDiffClasses/DiffRecipeIngredients";
import { Recipe } from "../../../shared/Recipe";
import { DiffRecipeIngredients } from "../classes/recipeDiffClasses/DiffRecipeIngredients";
import type { IngredientData } from "../../../shared/IngredientData";

type GPRecipeDiffType = {
  recipeA: Recipe;
  recipeB: Recipe;
  servingsDiff: boolean;
  recipeIngredientDiff: GPRecipeComparisonReturnType<IngredientData>;
  purchasedIngredientsDiff: GPRecipeComparisonReturnType<IngredientData>;
};
type GPDiffType = {
  recipeA: Recipe;
  recipeB: Recipe;
};
const getRecipeDiffResults = ({ recipeA, recipeB }: GPDiffType) => {
  const diffRecipeIngredients = new DiffRecipeIngredients(
    recipeA.ingredients,
    recipeB.ingredients
  );
  const diffRecipeIngredientsResults =
    diffRecipeIngredients.getIngredientsComparisonDiff();
  const diffIngredientsToPurchase = new DiffRecipeIngredients(
    recipeA.ingredientCostInfo,
    recipeB.ingredientCostInfo
  );
  const diffIngredientsToPurchaseResults =
    diffIngredientsToPurchase.getIngredientsComparisonDiff();
  const diffServingsResults = recipeA.servings !== recipeB.servings;
  const recipeDiffResults: GPRecipeDiffType = {
    recipeA,
    recipeB,
    servingsDiff: diffServingsResults,
    recipeIngredientDiff: diffRecipeIngredientsResults,
    purchasedIngredientsDiff: diffIngredientsToPurchaseResults,
  };
  return recipeDiffResults;
};

const DiffStatus = {
  UNCHANGED: "unchanged",
  CHANGED: "changed",
  ADDED: "added",
  DELETED: "deleted",
};

type GPDiffLineInfoType = {
  status: string;
  line: string;
  lineDiffInfo?: GPDiffLineInfoType[];
};

export { getRecipeDiffResults, DiffStatus };
export type { GPRecipeDiffType, GPDiffLineInfoType };
