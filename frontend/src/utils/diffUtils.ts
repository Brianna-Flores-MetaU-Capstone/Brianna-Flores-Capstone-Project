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

type GPLCSDiffTypes = {
  instructionsA: string[];
  instructionsB: string[];
};

const getInstructionsLCS = ({
  instructionsA,
  instructionsB,
}: GPLCSDiffTypes) => {
  // Adapted from https://www.geeksforgeeks.org/javascript/javascript-program-for-longest-common-subsequence/
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
  let instructionChanges: { status: string; line: string }[] = [];

  while (i > 0 && j > 0) {
    if (
      instructionsA[i - 1].toLowerCase() === instructionsB[j - 1].toLowerCase()
    ) {
      instructionChanges = [
        { status: DiffStatus.UNCHANGED, line: instructionsA[i - 1] },
        ...instructionChanges,
      ];
      index--;
      i--;
      j--;
    } else if (dp[i - 1][j] === dp[i][j - 1]) {
      // line was simultaneously added and deleted (possible change)
      instructionChanges = [
        { status: DiffStatus.DELETED, line: instructionsA[i - 1] },
        { status: DiffStatus.ADDED, line: instructionsB[j - 1] },
        ...instructionChanges,
      ];
      i--;
      j--;
    } else if (dp[i - 1][j] > dp[i][j - 1]) {
      instructionChanges = [
        { status: DiffStatus.DELETED, line: instructionsA[i - 1] },
        ...instructionChanges,
      ];
      i--;
    } else {
      instructionChanges = [
        { status: DiffStatus.ADDED, line: instructionsB[j - 1] },
        ...instructionChanges,
      ];
      j--;
    }
  }
  // array of lines (unchanged, added, or deleted)
  return instructionChanges;
};

type GPDiffLineInfoType = {
  status: string;
  line: string;
  lineDiffInfo?: GPDiffLineInfoType[];
};

type GPOrderInstructionLineType = {
  instructionDifferences: GPDiffLineInfoType[];
};

const checkForChangedLines = ({
  instructionDifferences,
}: GPOrderInstructionLineType) => {
  let prevLine: GPDiffLineInfoType | null = null;
  let detailedLineDiffResults: GPDiffLineInfoType[] = [];
  // loop through instruciton changes and see if there is a deleted instruction next to an added instruction
  for (const instructionLine of instructionDifferences) {
    if (
      prevLine &&
      ((instructionLine.status === DiffStatus.ADDED &&
        prevLine.status === DiffStatus.DELETED) ||
        (instructionLine.status === DiffStatus.DELETED &&
          prevLine.status === DiffStatus.ADDED))
    ) {
      const instructionLineA = instructionLine.line.split(" ");
      const instructionLineB = prevLine.line.split(" ");
      const lineDifferenceReturn = getInstructionsLCS({
        instructionsA: instructionLineA,
        instructionsB: instructionLineB,
      });
      const newInstructionLine = {
        status: DiffStatus.CHANGED,
        line:
          instructionLine.status === DiffStatus.ADDED
            ? instructionLine.line
            : prevLine.line,
        lineDiffInfo: lineDifferenceReturn,
      };
      // remove the previous line in the array
      detailedLineDiffResults = [
        ...detailedLineDiffResults,
        newInstructionLine,
      ];
      prevLine = null;
    } else {
      if (prevLine) {
        detailedLineDiffResults = [...detailedLineDiffResults, prevLine];
      }
      prevLine = instructionLine;
    }
  }
  if (prevLine) {
    detailedLineDiffResults = [...detailedLineDiffResults, prevLine];
  }
  return detailedLineDiffResults;
};

type GPIngredientDiffTypes = {
  recipeA: GPRecipeDataTypes;
  recipeB: GPRecipeDataTypes;
};

const getIngredientsDiff = ({ recipeA, recipeB }: GPIngredientDiffTypes) => {
  const ingredientsA = recipeA.ingredients;
  const ingredientsB = recipeB.ingredients;
  const parsedIngredientsA = ingredientsA.map(
    (ingredient) =>
      ingredient.ingredientName +
      " " +
      ingredient.quantity +
      " " +
      ingredient.unit
  );
  const parsedIngredientsB = ingredientsB.map(
    (ingredient) =>
      ingredient.ingredientName +
      " " +
      ingredient.quantity +
      " " +
      ingredient.unit
  );
  const diffIngredientLines = getInstructionsLCS({
    instructionsA: parsedIngredientsA,
    instructionsB: parsedIngredientsB,
  });
  const detailedIngredientsDiff = checkForChangedLines({
    instructionDifferences: diffIngredientLines,
  });
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
  getInstructionsLCS,
  checkForChangedLines,
  getLevenshteinDistance,
  getIngredientsDiff,
};
export type { GPRecipeDiffType };
