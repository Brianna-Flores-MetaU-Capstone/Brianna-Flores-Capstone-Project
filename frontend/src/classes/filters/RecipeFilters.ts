import type { GPRecipeDataTypes } from "../../utils/types";

const recipeFiltersList = {
  ALL: "all",
  DAIRY_FREE: "dairyFree",
  GLUTEN_FREE: "glutenFree",
  VEGETARIAN: "vegetarian",
  VEGAN: "vegan",
} as const;

type recipeFilterKeys = keyof typeof recipeFiltersList
type recipeFilterType = (typeof recipeFiltersList)[recipeFilterKeys]

class RecipeFilter {
  all: GPRecipeDataTypes[];
  dairyFree: GPRecipeDataTypes[];
  glutenFree: GPRecipeDataTypes[];
  vegetarian: GPRecipeDataTypes[];
  vegan: GPRecipeDataTypes[];

  constructor(old?: RecipeFilter) {
    this.all = old?.all ?? [];
    this.dairyFree = old?.dairyFree ?? [];
    this.glutenFree = old?.glutenFree ?? [];
    this.vegetarian = old?.vegetarian ?? [];
    this.vegan = old?.vegan ?? [];
  }

  get allRecipes(): GPRecipeDataTypes[] {
    return this.all;
  }
  get dairyFreeRecipes(): GPRecipeDataTypes[] {
    return this.dairyFree;
  }
  get glutenFreeRecipes(): GPRecipeDataTypes[] {
    return this.glutenFree;
  }
  get vegetarianRecipes(): GPRecipeDataTypes[] {
    return this.vegetarian;
  }
  get veganRecipes(): GPRecipeDataTypes[] {
    return this.vegan;
  }

  getFilteredList(filter: recipeFilterType) {
    return this[filter]
  }

  setFilteredList(filter: recipeFilterType, value: GPRecipeDataTypes[]) {
    this[filter] = value;
  }

  set allRecipes(value: GPRecipeDataTypes[]) {
    this.all = value;
  }
  set dairyFreeRecipes(value: GPRecipeDataTypes[]) {
    this.dairyFree = value;
  }
  set glutenFreeRecipes(value: GPRecipeDataTypes[]) {
    this.glutenFree = value;
  }
  set vegetarianRecipes(value: GPRecipeDataTypes[]) {
    this.vegetarian = value;
  }
  set veganRecipes(value: GPRecipeDataTypes[]) {
    this.vegan = value;
  }
}

export { RecipeFilter, recipeFiltersList, type recipeFilterType };
