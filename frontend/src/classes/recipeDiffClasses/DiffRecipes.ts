import { DiffRecipeStringArray } from "./DiffRecipeStringArray";
import { DiffRecipeIngredients } from "./DiffRecipeIngredients";
import type { Recipe } from "../recipe/Recipe";

const GPDiffOptionsEnum = {
  TITLE: "Diff Title",
  SERVINGS: "Diff Servings",
  COOK_TIME: "Diff Cook Time",
  TAGS: "Diff Recipe Tags",
  INGREDIENTS: "Diff Ingredients",
  INSTRUCTIONS: "Diff Instructions",
} as const;

class DiffRecipes {
  recipeA: Recipe;
  recipeB: Recipe;

  constructor(recipeA: Recipe, recipeB: Recipe) {
    this.recipeA = recipeA;
    this.recipeB = recipeB;
  }

  getRequestedDiff(diffRequest: string[], diffFromOriginal: boolean) {
    let requestedFields = {};
    for (const request of diffRequest) {
      switch (request) {
        case GPDiffOptionsEnum.TITLE:
          const titleDiffResults = this.getTitleDiff();
          requestedFields = { ...requestedFields, titleDiffResults };
          break;
        case GPDiffOptionsEnum.SERVINGS:
          const servingsDiffResults = this.getServingsDiff();
          requestedFields = { ...requestedFields, servingsDiffResults };
          break;
        case GPDiffOptionsEnum.COOK_TIME:
          const cookTimeDiffResults = this.getCookTimeDiff();
          requestedFields = { ...requestedFields, cookTimeDiffResults };
          break;
        case GPDiffOptionsEnum.TAGS:
          const tagsDiffResults = this.getTagDiff();
          requestedFields = { ...requestedFields, tagsDiffResults };
          break;
        case GPDiffOptionsEnum.INSTRUCTIONS:
          const instructionsDiffResults = diffFromOriginal
            ? this.getInstructionDiff()
            : this.getCourseInstrictionDiff();
          requestedFields = { ...requestedFields, instructionsDiffResults };
          break;
        case GPDiffOptionsEnum.INGREDIENTS:
          const ingredientsDiffResults = diffFromOriginal
            ? this.getIngredientsDiff()
            : this.getCourseIngredientsDiff();
          requestedFields = { ...requestedFields, ingredientsDiffResults };
          break;
      }
    }
    return requestedFields
  }

  getCourseIngredientsDiff() {
    const diffIngredients = new DiffRecipeIngredients(
      this.recipeA.ingredients,
      this.recipeB.ingredients
    );
    const ingredinetsDiffResults = diffIngredients.getIngredientsComparisonDiff();
    return ingredinetsDiffResults;
  }

  getCourseInstrictionDiff() {
    const diffInstructions = new DiffRecipeStringArray(
      this.recipeA.instructions,
      this.recipeB.instructions
    );
    const instructionsDiffResults = diffInstructions.getLcsDiff();
    return instructionsDiffResults;
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
    const diffInfo = {
      instructionsDiffResults,
      ingredientsDiffResults,
      titleDiffResults,
      servingsDiffResults,
      tagsDiffResults,
      cookTimeDiffResults,
    };
    return diffInfo;
  }
}

export { DiffRecipes };
