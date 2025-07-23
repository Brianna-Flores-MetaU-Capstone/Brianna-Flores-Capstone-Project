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

abstract class DiffRecipeFieldAbstract<T> {
  itemAData: T[];
  itemBData: T[];

  constructor(itemAData: T[], itemBData: T[]) {
    this.itemAData = itemAData;
    this.itemBData = itemBData;
  }

  /**
   * Utilizes the longest common substring algorithm as a basis to derive an algorithm applicable to an array and 
   * find the items that were unchanged, added, or deleted between the two lists to compare
   * @returns An array containing which items in the array are unchanged, added, or deleted
   */
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
    // add any leftover
    while (i > 0) {
      itemChanges = [
        { status: DiffStatus.DELETED, line: this.itemAData[i - 1] },
        ...itemChanges,
      ];
      i--;
    }
    while (j > 0) {
      itemChanges = [
        { status: DiffStatus.ADDED, line: this.itemBData[j - 1] },
        ...itemChanges,
      ];
      j--;
    }
    return itemChanges;
  }
}

export { DiffRecipeFieldAbstract, DiffStatus, type GPDiffLineInfoType };
