import { DiffRecipeStringArray } from "./DiffRecipeStringArray";
import {
  DiffRecipeFieldAbstract,
  type GPDiffLineInfoType,
} from "./DiffRecipeFieldAbstract";
import type { GPIngredientDataTypes } from "../../utils/types";
import { formatQuantity } from "../../utils/utils";

type GPQuantityChangeType<T> = {
  itemA: T;
  itemB: T;
};

type GPRecipeComparisonReturnType<T> = {
  added: T[];
  deleted: T[];
  changed: GPQuantityChangeType<T>[];
  unchanged: T[];
};

class DiffRecipeIngredients extends DiffRecipeFieldAbstract<GPIngredientDataTypes> {
  getIngredientsComparisonDiff() {
    let added: GPIngredientDataTypes[] = [];
    let changed: GPQuantityChangeType<GPIngredientDataTypes>[] = [];
    let deleted: GPIngredientDataTypes[] = [];
    let unchanged: GPIngredientDataTypes[] = [];
    let ingredientsAMap = new Map(
      this.itemAData.map((ingredient) => [
        ingredient.ingredientName,
        ingredient,
      ]),
    );
    let ingredientsBMap = new Map(
      this.itemBData.map((ingredient) => [
        ingredient.ingredientName,
        ingredient,
      ]),
    );

    for (const ingredientA of this.itemAData) {
      // iterate through ingredients in A
      if (!ingredientsBMap.has(ingredientA.ingredientName)) {
        // ingredient found in recipe A but not in B
        deleted = [...deleted, ingredientA];
      } else {
        const ingredientB = ingredientsBMap.get(ingredientA.ingredientName);
        if (ingredientB && ingredientB.quantity === ingredientA.quantity) {
          // ingredient found in B and same quantity w/o conversion
          unchanged = [...unchanged, ingredientA];
        } else if (ingredientB !== undefined) {
          changed = [...changed, { itemA: ingredientA, itemB: ingredientB }];
        }
      }
    }
    for (const ingredientB of this.itemBData) {
      if (!ingredientsAMap.has(ingredientB.ingredientName)) {
        added = [...added, ingredientB];
      }
    }
    const diffRecipeIngredients = {
      added: added,
      deleted: deleted,
      changed: changed,
      unchanged: unchanged,
    };
    return diffRecipeIngredients;
  }

  getIngredientsDiff(): GPDiffLineInfoType<string>[] {
    const ingredientsA = this.itemAData;
    const ingredientsB = this.itemBData;
    const parsedIngredientsA = ingredientsA.map(
      (ingredient) =>
        ingredient.ingredientName +
        " " +
        formatQuantity(ingredient.quantity) +
        " " +
        ingredient.unit,
    );
    const parsedIngredientsB = ingredientsB.map(
      (ingredient) =>
        ingredient.ingredientName +
        " " +
        formatQuantity(ingredient.quantity) +
        " " +
        ingredient.unit,
    );
    const ingredientDiff = new DiffRecipeStringArray(
      parsedIngredientsA,
      parsedIngredientsB,
    );
    const detailedIngredientsDiff = ingredientDiff.getStringArrayDiff();
    return detailedIngredientsDiff;
  }
}

export { DiffRecipeIngredients };
export type { GPRecipeComparisonReturnType };
