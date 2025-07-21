import type { GPIngredientDataTypes } from "../utils/types";

const DiffStatus = {
  UNCHANGED: "unchanged",
  CHANGED: "changed",
  ADDED: "added",
  DELETED: "deleted",
};

type GPDiffLineInfoType<T> = {
  status: string;
  line: T;
  lineDiffInfo?: GPDiffLineInfoType<T>[];
};

abstract class DiffRecipe<T> {
  itemAData: T[];
  itemBData: T[];

  constructor(itemAData: T[], itemBData: T[]) {
    this.itemAData = itemAData;
    this.itemBData = itemBData;
  }

  // define method since shared across diffs
  getLcsDiff(): GPDiffLineInfoType<T>[] {
    // Adapted from https://www.geeksforgeeks.org/javascript/javascript-program-for-longest-common-subsequence/
    const n = this.itemAData.length;
    const m = this.itemBData.length;

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
        if (this.itemAData[ind1 - 1] === this.itemBData[ind2 - 1]) {
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
    let itemChanges: GPDiffLineInfoType<T>[] = [];

    while (i > 0 && j > 0) {
      if (this.itemAData[i - 1] === this.itemBData[j - 1]) {
        itemChanges = [
          { status: DiffStatus.UNCHANGED, line: this.itemAData[i - 1] },
          ...itemChanges,
        ];
        index--;
        i--;
        j--;
      } else if (dp[i - 1][j] === dp[i][j - 1]) {
        // line was simultaneously added and deleted (possible change)
        itemChanges = [
          { status: DiffStatus.DELETED, line: this.itemAData[i - 1] },
          { status: DiffStatus.ADDED, line: this.itemBData[j - 1] },
          ...itemChanges,
        ];
        i--;
        j--;
      } else if (dp[i - 1][j] > dp[i][j - 1]) {
        itemChanges = [
          { status: DiffStatus.DELETED, line: this.itemAData[i - 1] },
          ...itemChanges,
        ];
        i--;
      } else {
        itemChanges = [
          { status: DiffStatus.ADDED, line: this.itemBData[j - 1] },
          ...itemChanges,
        ];
        j--;
      }
    }
    // array of lines (unchanged, added, or deleted)
    return itemChanges;
  }
}

class DiffRecipeString extends DiffRecipe<string> {
  getStringDiff(): GPDiffLineInfoType<string>[] {
    const lineDifferences = this.getLcsDiff();
    let prevLine: GPDiffLineInfoType<string> | null = null;
    let detailedLineDiffResults: GPDiffLineInfoType<string>[] = [];
    // loop through instruciton changes and see if there is a deleted instruction next to an added instruction
    for (const diffLine of lineDifferences) {
      if (
        prevLine &&
        ((diffLine.status === DiffStatus.ADDED &&
          prevLine.status === DiffStatus.DELETED) ||
          (diffLine.status === DiffStatus.DELETED &&
            prevLine.status === DiffStatus.ADDED))
      ) {
        const instructionLineA =
          diffLine.status === DiffStatus.DELETED
            ? diffLine.line.split(" ")
            : prevLine.line.split(" ");
        const instructionLineB =
          prevLine.status === DiffStatus.ADDED
            ? prevLine.line.split(" ")
            : diffLine.line.split(" ");
        const newDiff = new DiffRecipeString(
          instructionLineA,
          instructionLineB
        );
        const lineDifferenceReturn = newDiff.getLcsDiff();
        const newInstructionLine = {
          status: DiffStatus.CHANGED,
          line:
            diffLine.status === DiffStatus.ADDED
              ? diffLine.line
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
        prevLine = diffLine;
      }
    }
    if (prevLine) {
      detailedLineDiffResults = [...detailedLineDiffResults, prevLine];
    }
    return detailedLineDiffResults;
  }
}

class DiffRecipeIngredients extends DiffRecipe<GPIngredientDataTypes> {
  getIngredientsDiff(): GPDiffLineInfoType<string>[] {
    const ingredientsA = this.itemAData;
    const ingredientsB = this.itemBData;
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
    const ingredientDiff = new DiffRecipeString(
      parsedIngredientsA,
      parsedIngredientsB
    );
    const detailedIngredientsDiff = ingredientDiff.getStringDiff();
    return detailedIngredientsDiff;
  }
}

export { DiffRecipe, DiffRecipeString, DiffRecipeIngredients };
