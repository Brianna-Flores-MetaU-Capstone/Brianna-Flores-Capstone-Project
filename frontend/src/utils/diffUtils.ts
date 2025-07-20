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

const getLCS = ({ recipeA, recipeB }: GPDiffType) => {
  const instructionsA = recipeA.instructions;
  const instructionsB = recipeB.instructions;
  const n = instructionsA.length;
  const m = instructionsB.length;

  const dp = new Array(n + 1).fill(null).map(() => new Array(m + 1).fill(0));
  for (let i = 0; i <= n; i++) {
    dp[i][0] = 0;
  }
  for (let i = 0; i <= m; i++) {
    dp[0][i] = 0;
  }

  for (let ind1 = 1; ind1 <= n; ind1++) {
    for (let ind2 = 1; ind2 <= m; ind2++) {
      // Dont take into consideration capitalization differences, to lowercase
      if (
        instructionsA[ind1 - 1].toLowerCase() ===
        instructionsB[ind2 - 1].toLowerCase()
      ) {
        dp[ind1][ind2] = 1 + dp[ind1 - 1][ind2 - 1];
      } else {
        dp[ind1][ind2] = Math.max(dp[ind1 - 1][ind2], dp[ind1][ind2 - 1]);
      }
    }
  }

  // reconstruct
  const len = dp[n][m];
  let i = n;
  let j = m;
  let index = len - 1;
  let unchanged: string[] = [];
  let added: string[] = [];
  let deleted: string[] = []

  while (i > 0 && j > 0) {
    if (instructionsA[i - 1] === instructionsB[j - 1]) {
      unchanged = [instructionsA[i - 1], ...unchanged];
      index--;
      i--;
      j--;
    } else if (dp[i - 1][j] > dp[i][j - 1]) {
      deleted = [instructionsA[i - 1], ...deleted]
      i--;
    } else {
      added = [instructionsB[j - 1], ...added]
      j--;
    }
  }
  // array of unchanged lines
  return unchanged;
};

export { getRecipeDiffResults, getLCS };
export type { GPRecipeDiffType };
