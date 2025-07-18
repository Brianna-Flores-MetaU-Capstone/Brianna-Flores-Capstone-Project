import type { GPIngredientDataTypes } from "../utils/types";

type GPQuantityChangeType<T> = {
  itemA: T;
  itemB: T;
};
type GPDiffReturnType<T> = {
  added: T[];
  deleted: T[];
  changed: GPQuantityChangeType<T>[];
  unchanged: T[];
};

abstract class Diff<T> {
  abstract getDiff(itemA: T[], itemB: T[]): GPDiffReturnType<T>;
}

class RecipeIngredientsDiff extends Diff<GPIngredientDataTypes> {
  getDiff(itemA: GPIngredientDataTypes[], itemB: GPIngredientDataTypes[]) {
    let added: GPIngredientDataTypes[] = [];
    let changed: GPQuantityChangeType<GPIngredientDataTypes>[] = [];
    let deleted: GPIngredientDataTypes[] = [];
    let unchanged: GPIngredientDataTypes[] = [];
    let ingredientsAMap = new Map(
      itemA.map((ingredient) => [ingredient.ingredientName, ingredient])
    );
    let ingredientsBMap = new Map(
      itemB.map((ingredient) => [ingredient.ingredientName, ingredient])
    );

    for (const ingredientA of itemA) {
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
    for (const ingredientB of itemB) {
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
}

export { RecipeIngredientsDiff };
