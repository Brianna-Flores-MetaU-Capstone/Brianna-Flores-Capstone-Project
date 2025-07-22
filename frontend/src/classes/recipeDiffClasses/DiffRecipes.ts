import { DiffRecipeStringArray } from "./DiffRecipeStringArray";
import { DiffRecipeIngredients } from "./DiffRecipeIngredients";
import type { Recipe } from "../recipe/Recipe";
import { DiffStatus, type GPDiffLineInfoType } from "./DiffRecipeFieldAbstract";

const GPDiffOptionsEnum = {
  TITLE: "Diff Title",
  SERVINGS: "Diff Servings",
  COOK_TIME: "Diff Cook Time",
  TAGS: "Diff Recipe Tags",
  INGREDIENTS: "Diff Ingredients",
  INSTRUCTIONS: "Diff Instructions",
} as const;

type DiffOptionsKeys = keyof typeof GPDiffOptionsEnum;
type DiffOptionsType = (typeof GPDiffOptionsEnum)[DiffOptionsKeys];

class DiffRecipes {
  recipeA: Recipe;
  recipeB: Recipe;

  constructor(recipeA: Recipe, recipeB: Recipe) {
    this.recipeA = recipeA;
    this.recipeB = recipeB;
  }

  getRequestedDiff(diffRequest: string[], noDiffFields: string[]) {
    const chosenDiffFieldResults = this.getChosenDiffFields(diffRequest);
    const noDiffFieldResults = this.getNoDiffFields(noDiffFields);
    return { ...chosenDiffFieldResults, ...noDiffFieldResults };
  }

  // get diff results for fields chosen by user
  getChosenDiffFields(chosenDiffFields: string[]) {
    let requestedFields = {};
    for (const request of chosenDiffFields) {
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
          const instructionsDiffResults = this.getInstructionDiff();
          requestedFields = { ...requestedFields, instructionsDiffResults };
          break;
        case GPDiffOptionsEnum.INGREDIENTS:
          const ingredientsDiffResults = this.getIngredientsDiff();
          requestedFields = { ...requestedFields, ingredientsDiffResults };
          break;
      }
    }
    return requestedFields;
  }

  // get results for edited recipe in "diff line" format
  getNoDiffFields(noDiffFields: string[]) {
    let noDiffFieldResults = {};
    for (const request of noDiffFields) {
      switch (request) {
        case GPDiffOptionsEnum.TITLE:
          const titleDiffResults = this.getTitleNoDiff();
          noDiffFieldResults = { ...noDiffFieldResults, titleDiffResults };
          break;
        case GPDiffOptionsEnum.SERVINGS:
          const servingsDiffResults = this.getServingsNoDiff();
          noDiffFieldResults = { ...noDiffFieldResults, servingsDiffResults };
          break;
        case GPDiffOptionsEnum.COOK_TIME:
          const cookTimeDiffResults = this.getCookTimeNoDiff();
          noDiffFieldResults = { ...noDiffFieldResults, cookTimeDiffResults };
          break;
        case GPDiffOptionsEnum.TAGS:
          const tagsDiffResults = this.getTagNoDiff();
          noDiffFieldResults = { ...noDiffFieldResults, tagsDiffResults };
          break;
        case GPDiffOptionsEnum.INSTRUCTIONS:
          const instructionsDiffResults = this.getInstructionNoDiff();
          noDiffFieldResults = {
            ...noDiffFieldResults,
            instructionsDiffResults,
          };
          break;
        case GPDiffOptionsEnum.INGREDIENTS:
          const ingredientsDiffResults = this.getIngredientsNoDiff();
          noDiffFieldResults = {
            ...noDiffFieldResults,
            ingredientsDiffResults,
          };
          break;
      }
    }
    return noDiffFieldResults;
  }

  getCourseIngredientsDiff() {
    const diffIngredients = new DiffRecipeIngredients(
      this.recipeA.ingredients,
      this.recipeB.ingredients,
    );
    const ingredinetsDiffResults =
      diffIngredients.getIngredientsComparisonDiff();
    return ingredinetsDiffResults;
  }

  getCourseInstrictionDiff() {
    const diffInstructions = new DiffRecipeStringArray(
      this.recipeA.instructions,
      this.recipeB.instructions,
    );
    const instructionsDiffResults = diffInstructions.getLcsDiff();
    return instructionsDiffResults;
  }

  getInstructionDiff() {
    const diffInstructions = new DiffRecipeStringArray(
      this.recipeA.instructions,
      this.recipeB.instructions,
    );
    const instructionsDiffResults = diffInstructions.getStringArrayDiff();
    return instructionsDiffResults;
  }

  getInstructionNoDiff() {
    let instructionsDiffResults: GPDiffLineInfoType<string>[] = [];
    for (const instruction of this.recipeB.instructions) {
      instructionsDiffResults = [
        ...instructionsDiffResults,
        { status: DiffStatus.UNCHANGED, line: instruction },
      ];
    }
    return instructionsDiffResults;
  }

  getIngredientsDiff() {
    const diffIngredients = new DiffRecipeIngredients(
      this.recipeA.ingredients,
      this.recipeB.ingredients,
    );
    const ingredientsDiffResults = diffIngredients.getIngredientsDiff();
    return ingredientsDiffResults;
  }

  getIngredientsNoDiff() {
    const diffIngredients = new DiffRecipeIngredients(
      this.recipeA.ingredients,
      this.recipeA.ingredients,
    );
    const ingredientsDiffResults = diffIngredients.getIngredientsDiff();
    return ingredientsDiffResults;
  }

  getTitleDiff() {
    const diffTitle = new DiffRecipeStringArray(
      [this.recipeA.recipeTitle],
      [this.recipeB.recipeTitle],
    );
    const titleDiffResults = diffTitle.getStringArrayDiff();
    return titleDiffResults;
  }

  getTitleNoDiff() {
    return [{ status: DiffStatus.UNCHANGED, line: this.recipeB.recipeTitle }];
  }

  getServingsDiff() {
    const diffServings = new DiffRecipeStringArray(
      [this.recipeA.servings.toString()],
      [this.recipeB.servings.toString()],
    );
    const servingsDiffResults = diffServings.getStringArrayDiff();
    return servingsDiffResults;
  }

  getServingsNoDiff() {
    return [{ status: DiffStatus.UNCHANGED, line: this.recipeB.servings }];
  }

  getTagDiff() {
    const diffTags = new DiffRecipeStringArray(
      this.recipeA.recipeTags,
      this.recipeB.recipeTags,
    );
    const tagsDiffResults = diffTags.getStringArrayDiff();
    return tagsDiffResults;
  }

  getTagNoDiff() {
    let tagDiffResults: GPDiffLineInfoType<string>[] = [];
    for (const tag of this.recipeB.recipeTags) {
      tagDiffResults = [
        ...tagDiffResults,
        { status: DiffStatus.UNCHANGED, line: tag },
      ];
    }
    return tagDiffResults;
  }

  getCookTimeDiff() {
    const diffCookTime = new DiffRecipeStringArray(
      [this.recipeA.readyInMinutes.toString()],
      [this.recipeB.readyInMinutes.toString()],
    );
    const cookTimeDiffResults = diffCookTime.getStringArrayDiff();
    return cookTimeDiffResults;
  }

  getCookTimeNoDiff() {
    return [
      { status: DiffStatus.UNCHANGED, line: this.recipeB.readyInMinutes },
    ];
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

export { DiffRecipes, GPDiffOptionsEnum };
