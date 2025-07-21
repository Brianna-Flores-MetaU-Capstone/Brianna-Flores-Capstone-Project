import type { GPIngredientDataTypes, GPRecipeDataTypes } from "./types";
import { RecipeIngredientsDiff } from "../classes/DiffClass";
import type { GPDiffReturnType } from "../classes/DiffClass";

type GPRecipeDiffType = {
  recipeA: GPRecipeDataTypes;
  recipeB: GPRecipeDataTypes;
  servingsDiff: boolean;
  recipeIngredientDiff: GPDiffReturnType<GPIngredientDataTypes>;
  purchasedIngredientsDiff: GPDiffReturnType<GPIngredientDataTypes>;
};
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

type GPLevenshteinDistanceType = {
  strA: string;
  strB: string;
};
const getLevenshteinDistance = ({ strA, strB }: GPLevenshteinDistanceType) => {
  if (!strA.length) return strB.length;
  if (!strB.length) return strA.length;
  const arr = [];
  for (let i = 0; i <= strB.length; i++) {
    arr[i] = [i];
    for (let j = 1; j <= strA.length; j++) {
      arr[i][j] =
        i === 0
          ? j
          : Math.min(
              arr[i - 1][j] + 1,
              arr[i][j - 1] + 1,
              arr[i - 1][j - 1] + (strA[j - 1] === strB[i - 1] ? 0 : 1)
            );
    }
  }
  return arr[strB.length][strA.length];
};

export {
  getRecipeDiffResults,
  DiffStatus
};
export type { GPRecipeDiffType, GPDiffLineInfoType };
