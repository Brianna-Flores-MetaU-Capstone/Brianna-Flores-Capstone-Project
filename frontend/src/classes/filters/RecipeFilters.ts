import type { Recipe } from "../../../../shared/Recipe";

const recipeFiltersList = {
  ALL: "all",
  DAIRY_FREE: "dairyFree",
  GLUTEN_FREE: "glutenFree",
  VEGETARIAN: "vegetarian",
  VEGAN: "vegan",
} as const;

type recipeFilterKeys = keyof typeof recipeFiltersList;
type recipeFilterType = (typeof recipeFiltersList)[recipeFilterKeys];

class RecipeFilter {
  all: Recipe[];
  dairyFree: Recipe[];
  glutenFree: Recipe[];
  vegetarian: Recipe[];
  vegan: Recipe[];

  constructor(old?: RecipeFilter) {
    this.all = old?.all ?? [];
    this.dairyFree = old?.dairyFree ?? [];
    this.glutenFree = old?.glutenFree ?? [];
    this.vegetarian = old?.vegetarian ?? [];
    this.vegan = old?.vegan ?? [];
  }

  get allRecipes(): Recipe[] {
    return this.all;
  }
  get dairyFreeRecipes(): Recipe[] {
    return this.dairyFree;
  }
  get glutenFreeRecipes(): Recipe[] {
    return this.glutenFree;
  }
  get vegetarianRecipes(): Recipe[] {
    return this.vegetarian;
  }
  get veganRecipes(): Recipe[] {
    return this.vegan;
  }

  /**
   * get the list of recipes that matches the given filter
   * @param filter the list of recipes to get
   * @returns a list of recipes matching the criteria (all, dairy free, gluten free, vegetarian, vegan)
   */
  getFilteredList(filter: recipeFilterType) {
    return this[filter];
  }

  /**
   * set the list of recipes that matches the given filter
   * @param filter the list of recipes to set
   * @param value an array of recipes to set the filtered list to
   */
  setFilteredList(filter: recipeFilterType, value: Recipe[]) {
    this[filter] = value;
  }

  set allRecipes(value: Recipe[]) {
    this.all = value;
  }
  set dairyFreeRecipes(value: Recipe[]) {
    this.dairyFree = value;
  }
  set glutenFreeRecipes(value: Recipe[]) {
    this.glutenFree = value;
  }
  set vegetarianRecipes(value: Recipe[]) {
    this.vegetarian = value;
  }
  set veganRecipes(value: Recipe[]) {
    this.vegan = value;
  }
}

export { RecipeFilter, recipeFiltersList, type recipeFilterType };
