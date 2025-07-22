import type { GPIngredientDataTypes } from "../../utils/types";

class Recipe {
  readonly id: number;
  readonly apiId: number;
  readonly originalSource: string;
  readonly editingAuthorName: string;
  readonly editingAuthorId: number | null;
  readonly recipeTitle: string;
  readonly previewImage: string;
  readonly servings: number;
  readonly ingredients: GPIngredientDataTypes[];
  readonly instructions: string[];
  readonly sourceUrl: string;
  readonly readyInMinutes: number;
  readonly vegetarian: boolean;
  readonly vegan: boolean;
  readonly glutenFree: boolean;
  readonly dairyFree: boolean;
  readonly recipeTags: string[];
  ingredientCostInfo: GPIngredientDataTypes[];
  totalCost: number;

  constructor(
    apiId: number,
    originalSource: string,
    recipeTitle: string,
    previewImage: string,
    servings: number,
    ingredients: GPIngredientDataTypes[],
    instructions: string[],
    sourceUrl: string,
    readyInMinutes: number,
    vegetarian: boolean,
    vegan: boolean,
    glutenFree: boolean,
    dairyFree: boolean,
    recipeTags: string[],
    editingAuthorId: number | null,
    id?: number,
    editingAuthorName?: string,
    ingredientCostInfo?: GPIngredientDataTypes[],
    totalCost?: number
  ) {
    this.apiId = apiId;
    this.originalSource = originalSource;
    this.recipeTitle = recipeTitle;
    this.previewImage = previewImage;
    this.servings = servings;
    this.ingredients = ingredients;
    this.instructions = instructions;
    this.sourceUrl = sourceUrl;
    this.readyInMinutes = readyInMinutes;
    this.vegetarian = vegetarian;
    this.vegan = vegan;
    this.glutenFree = glutenFree;
    this.dairyFree = dairyFree;
    this.recipeTags = recipeTags;
    this.id = id ?? 0;
    this.editingAuthorName = editingAuthorName ?? "";
    this.editingAuthorId = editingAuthorId ?? null;
    this.ingredientCostInfo = ingredientCostInfo ?? [];
    this.totalCost = totalCost ?? 0;
  }

  set setIngredientCostInfo(value: GPIngredientDataTypes[]) {
    this.ingredientCostInfo = value;
  }

  set setTotalCost(value: number) {
    this.totalCost = value;
  }
}

export { Recipe };
