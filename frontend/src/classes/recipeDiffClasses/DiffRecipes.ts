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

  getInstructionDiff() {
    const diffInstructions = new DiffRecipeStringArray(
      this.recipeA.instructions,
      this.recipeB.instructions
    );
    const instructionsDiffResults = diffInstructions.getStringArrayDiff();
    return instructionsDiffResults;
  }

  getIngredientsDiff() {
    const diffIngredients = new DiffRecipeIngredients(
      this.recipeA.ingredients,
      this.recipeB.ingredients
    );
    const ingredientsDiffResults = diffIngredients.getIngredientsDiff();
    return ingredientsDiffResults;
  }

  getTitleDiff() {
    const diffTitle = new DiffRecipeStringArray(
      [this.recipeA.recipeTitle],
      [this.recipeB.recipeTitle]
    );
    const titleDiffResults = diffTitle.getStringArrayDiff();
    return titleDiffResults;
  }

  getServingsDiff() {
    const diffServings = new DiffRecipeStringArray(
      [this.recipeA.servings.toString()],
      [this.recipeB.servings.toString()]
    );
    const servingsDiffResults = diffServings.getStringArrayDiff();
    return servingsDiffResults;
  }

  getTagDiff() {
    const diffTags = new DiffRecipeStringArray(
      this.recipeA.recipeTags,
      this.recipeB.recipeTags
    );
    const tagsDiffResults = diffTags.getStringArrayDiff();
    return tagsDiffResults;
  }

  getCookTimeDiff() {
    const diffCookTime = new DiffRecipeStringArray(
      [this.recipeA.readyInMinutes.toString()],
      [this.recipeB.readyInMinutes.toString()]
    );
    const cookTimeDiffResults = diffCookTime.getStringArrayDiff();
    return cookTimeDiffResults;
  }

  getFullRecipeDiff() {
    const instructionsDiffResults = this.getInstructionDiff();
    const ingredientsDiffResults = this.getIngredientsDiff();
    const titleDiffResults = this.getTitleDiff();
    const servingsDiffResults = this.getServingsDiff();
    const tagsDiffResults = this.getTagDiff();
    const cookTimeDiffResults = this.getCookTimeDiff();

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
