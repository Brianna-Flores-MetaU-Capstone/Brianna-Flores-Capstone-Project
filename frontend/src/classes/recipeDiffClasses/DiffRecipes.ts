import { DiffRecipeStringArray } from "./DiffRecipeStringArray";
import { DiffRecipeIngredients } from "./DiffRecipeIngredients";
import type { Recipe } from "../recipe/Recipe";

class DiffRecipes {
  recipeA: Recipe;
  recipeB: Recipe;

  constructor(recipeA: Recipe, recipeB: Recipe) {
    this.recipeA = recipeA;
    this.recipeB = recipeB;
  }

  getRecipeDiff() {
    const diffInstructions = new DiffRecipeStringArray(
      this.recipeA.instructions,
      this.recipeB.instructions
    );
    const instructionsDiffResults = diffInstructions.getStringArrayDiff();
    const diffIngredients = new DiffRecipeIngredients(
      this.recipeA.ingredients,
      this.recipeB.ingredients
    );
    const ingredientsDiffResults = diffIngredients.getIngredientsDiff();
    const diffTitle = new DiffRecipeStringArray(
      [this.recipeA.recipeTitle],
      [this.recipeB.recipeTitle]
    );
    const titleDiffResults = diffTitle.getStringArrayDiff();
    const diffServings = new DiffRecipeStringArray(
      [this.recipeA.servings.toString()],
      [this.recipeB.servings.toString()]
    );
    const servingsDiffResults = diffServings.getStringArrayDiff();
    const diffTags = new DiffRecipeStringArray(
      this.recipeA.recipeTags,
      this.recipeB.recipeTags
    );
    const tagsDiffResults = diffTags.getStringArrayDiff();
    const diffCookTime = new DiffRecipeStringArray(
      [this.recipeA.readyInMinutes.toString()],
      [this.recipeB.readyInMinutes.toString()]
    );
    const cookTimeDiffResults = diffCookTime.getStringArrayDiff();
    return {
      instructionsDiffResults,
      ingredientsDiffResults,
      titleDiffResults,
      servingsDiffResults,
      tagsDiffResults,
      cookTimeDiffResults,
    };
  }
}

export { DiffRecipes };
