import { DiffRecipeStringArray } from "./DiffRecipeStringArray";
import { DiffRecipeIngredients } from "./DiffRecipeIngredients";
import { Recipe } from "../../../../shared/Recipe";
import { DiffStatus, type GPDiffLineInfoType } from "./DiffRecipeFieldAbstract";

const GPDiffOptionsEnum = {
  TITLE: "Title",
  SERVINGS: "Servings",
  COOK_TIME: "Cook Time",
  TAGS: "Recipe Tags",
  INGREDIENTS: "Ingredients",
  INSTRUCTIONS: "Instructions",
  IMAGES: "Images",
} as const;

class DiffRecipes {
  recipeA: Recipe;
  recipeB: Recipe;

  constructor(recipeA: Recipe, recipeB: Recipe) {
    this.recipeA = recipeA;
    this.recipeB = recipeB;
  }

  /**
   * Diff only the fields the user requested to have diffed, otherwise present the
   * @param diffRequest array containing the GPDiffOptionsEnum values for the fields the user requested to be diffed
   * @param noDiffFields array containing the GPDiffOptionsEnum values for fields that should not be diffed; simply present the edited recipe's information
   * @returns an object containing the results from the fields that were requested to be diffed and the rest of the fields marked as unchanged and present the edited recipe
   */
  getRequestedDiff(diffRequest: string[], noDiffFields: string[]) {
    const chosenDiffFieldResults = this.getChosenDiffFields(diffRequest);
    const noDiffFieldResults = this.getNoDiffFields(noDiffFields);
    return { ...chosenDiffFieldResults, ...noDiffFieldResults };
  }

  /**
   * run the diff on the fields chosen by the user
   * @param chosenDiffFields an array containing the GPDiffOptionsEnum values for the fields the user chose to have diffed
   * @returns object containing diff results
   */
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
        case GPDiffOptionsEnum.IMAGES:
          const imageDiffResults = this.getImageDiff();
          requestedFields = { ...requestedFields, imageDiffResults };
          break;
      }
    }
    return requestedFields;
  }

  /**
   * Format the fields the user did not request to be in diff format with status of unchanged to be correctly presented in modal.
   * @param noDiffFields an array containing the GPDiffOptionsEnum values for the fields the user did not choose to have diffed
   * @returns object containing edited recipe information labeled with the status as unchanged
   */
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
        case GPDiffOptionsEnum.IMAGES:
          const imageDiffResults = this.getImageNoDiff();
          noDiffFieldResults = {
            ...noDiffFieldResults,
            imageDiffResults,
          };
      }
    }
    return noDiffFieldResults;
  }

  /**
   * Less fine grained diffing method used when comparing recipes
   * @returns ingredient diff results in the form of added, deleted, changed, and unchanged
   */
  getCourseIngredientsDiff() {
    const diffIngredients = new DiffRecipeIngredients(
      this.recipeA.ingredients,
      this.recipeB.ingredients
    );
    const ingredinetsDiffResults =
      diffIngredients.getIngredientsComparisonDiff();
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

  /**
   * Find the difference in images between the original and edited recipe
   * @returns array containing the status between the original recipes images and the edited recipes images
   */
  getImageDiff() {
    const diffImages = new DiffRecipeStringArray(
      this.recipeA.previewImage,
      this.recipeB.previewImage
    );
    const imageDiffResults = diffImages.getStringArrayDiff();
    return imageDiffResults;
  }

  /**
   * format the edited recipes images into diff format with unchanged status
   * @returns array in the format of diff line info
   */
  getImageNoDiff() {
    let imageNoDiffResults: GPDiffLineInfoType<string>[] = [];
    for(const image of this.recipeB.previewImage) {
      imageNoDiffResults = [...imageNoDiffResults, { status: DiffStatus.UNCHANGED, line: image}]
    }
    return imageNoDiffResults
  }

  /**
   * Find the delta between the original recipe and the edited recipes' instructions
   * @returns array containing the status (changed, unchanged, added, removed) between an original recipes instructions and the edited recipes instructions
   */
  getInstructionDiff() {
    const diffInstructions = new DiffRecipeStringArray(
      this.recipeA.instructions,
      this.recipeB.instructions
    );
    const instructionsDiffResults = diffInstructions.getStringArrayDiff();
    return instructionsDiffResults;
  }

  /**
   * Format the edited recipe's instructions in diff format with status unchanged
   * @returns array of status/line objects
   */
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

  /**
   * find the diff between two recipes' ingredients
   * @returns array of status/line objects
   */
  getIngredientsDiff() {
    const diffIngredients = new DiffRecipeIngredients(
      this.recipeA.ingredients,
      this.recipeB.ingredients
    );
    const ingredientsDiffResults = diffIngredients.getIngredientsDiff();
    return ingredientsDiffResults;
  }

  /**
   * Format the edited recipe's ingredients in diff format with status unchanged
   * @returns array of status/line objects
   */
  getIngredientsNoDiff() {
    const diffIngredients = new DiffRecipeIngredients(
      this.recipeA.ingredients,
      this.recipeA.ingredients
    );
    const ingredientsDiffResults = diffIngredients.getIngredientsDiff();
    return ingredientsDiffResults;
  }

  /**
   * Find the diff between two recipes' titles
   * @returns array of status/line objects
   */
  getTitleDiff() {
    const diffTitle = new DiffRecipeStringArray(
      [this.recipeA.recipeTitle],
      [this.recipeB.recipeTitle]
    );
    const titleDiffResults = diffTitle.getStringArrayDiff();
    return titleDiffResults;
  }

  /**
   * Format the edited recipe's title in diff format with status unchanged
   * @returns array of status/line objects
   */
  getTitleNoDiff() {
    return [{ status: DiffStatus.UNCHANGED, line: this.recipeB.recipeTitle }];
  }

  /**
   * Find the diff between two recipes' servings
   * @returns array of status/line objects
   */
  getServingsDiff() {
    const diffServings = new DiffRecipeStringArray(
      [this.recipeA.servings.toString()],
      [this.recipeB.servings.toString()]
    );
    const servingsDiffResults = diffServings.getStringArrayDiff();
    return servingsDiffResults;
  }

  /**
   * Format the edited recipe's servings in diff format with status unchanged
   * @returns array of status/line objects
   */
  getServingsNoDiff() {
    return [{ status: DiffStatus.UNCHANGED, line: this.recipeB.servings }];
  }

  /**
   * Find the diff between two recipes tags
   * @returns array of status/line objects
   */
  getTagDiff() {
    const diffTags = new DiffRecipeStringArray(
      this.recipeA.recipeTags,
      this.recipeB.recipeTags
    );
    const tagsDiffResults = diffTags.getStringArrayDiff();
    return tagsDiffResults;
  }

  /**
   * Format the edited recipe's tags in diff format with status unchanged
   * @returns array of status/line objects
   */
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

  /**
   * Determine whether the cook time has changed
   * @returns array of status/line objects
   */
  getCookTimeDiff() {
    const diffCookTime = new DiffRecipeStringArray(
      [this.recipeA.readyInMinutes.toString()],
      [this.recipeB.readyInMinutes.toString()]
    );
    const cookTimeDiffResults = diffCookTime.getStringArrayDiff();
    return cookTimeDiffResults;
  }

  /**
   * Format the edited recipe's cook time in diff format with status unchanged
   * @returns array of status/line objects
   */
  getCookTimeNoDiff() {
    return [
      { status: DiffStatus.UNCHANGED, line: this.recipeB.readyInMinutes },
    ];
  }

  /**
   * Diff a recipes title, servings, cook time, tags, ingredients, and instructions
   * @returns Object containing diff information for all fields in a recipe
   */
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
