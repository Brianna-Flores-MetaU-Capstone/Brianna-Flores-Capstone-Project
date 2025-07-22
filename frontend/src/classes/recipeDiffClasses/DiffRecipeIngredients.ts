import { DiffRecipeStringArray } from "./DiffRecipeStringArray";
import {
  DiffRecipeFieldAbstract,
  type GPDiffLineInfoType,
} from "./DiffRecipeFieldAbstract";
import type { GPIngredientDataTypes } from "../../utils/types";

class DiffRecipeIngredients extends DiffRecipeFieldAbstract<GPIngredientDataTypes> {
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
    const ingredientDiff = new DiffRecipeStringArray(
      parsedIngredientsA,
      parsedIngredientsB
    );
    const detailedIngredientsDiff = ingredientDiff.getStringArrayDiff();
    return detailedIngredientsDiff;
  }
}

export { DiffRecipeIngredients };
