import {
  DiffRecipeFieldAbstract,
  DiffStatus,
  type GPDiffLineInfoType,
} from "./DiffRecipeFieldAbstract";

class DiffRecipeStringArray extends DiffRecipeFieldAbstract<string> {
  /**
   * Iterates through the resulting array from the initial getLcsDiff() call
   * Neighboring ADDED/DELETED lines are marked as changed
   * Line is then split and getLcsDiff() is run again on resulting objects to find a finer grained delta
   * @returns array of status/line objects which contains a nested array of status/line objects for CHANGED lines
   */
  getStringArrayDiff(): GPDiffLineInfoType<string>[] {
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
        const newDiff = new DiffRecipeStringArray(
          instructionLineA,
          instructionLineB,
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

export { DiffRecipeStringArray };
