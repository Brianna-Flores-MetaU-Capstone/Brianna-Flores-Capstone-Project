import TimeBlock from "../../../../backend/classes/TimeBlock";
import type { Recipe } from "../../../../shared/Recipe";
import type { IngredientData } from "../../../../shared/IngredientData";
import type { IngredientSubstitutes } from "../../classes/ingredients/IngredientSubstitutes";

type GPRecipeDataTypes = {
  id: number;
  apiId: number;
  originalSource: string;
  editingAuthorName: string;
  editingAuthorId: number | null;
  recipeTitle: string;
  previewImage: string[];
  servings: number;
  ingredients: IngredientData[];
  instructions: string[];
  sourceUrl: string;
  readyInMinutes: number;
  vegetarian: boolean;
  vegan: boolean;
  glutenFree: boolean;
  dairyFree: boolean;
  recipeTags: string[];
  ingredientCostInfo?: IngredientData[];
  totalCost?: number;
};

type GPIngredientDataTypes = {
  id: number;
  ingredientName: string;
  quantity: number;
  unit: string;
  department: string;
  expirationDate?: string | null;
  isChecked: boolean;
  ingredientCost?: number;
  ingredientCostUnit?: string;
  ingredientSubstitutes?: IngredientSubstitutes[];
};

type GPEstimateRecipeCostReturnTypes = {
  ingredientCostInfo: IngredientData[];
  estimatedCost: number;
};

type GPErrorMessageTypes = {
  error: boolean;
  message: string;
};

type GPOwnedIngredientsTypes = {
  userId: string;
  ingredient: IngredientData;
  ingredientId: string;
};

type GPRecipeIngredientTypes = {
  id: number;
  unit: string;
  quantity: number;
  department: string;
  ingredientName: string;
  isChecked: boolean;
};

type GPIngredientApiInfoType = {
  ingredientCost: number;
  ingredientCostUnit: string;
};

type GPUserEventTypes = {
  name: string;
  start: Date;
  end: Date;
};

type GPRecipeEventOptionType = {
  name: string;
  timeOptions: TimeBlock[];
  recipe: Recipe;
};

type GPRecipeDiscoveryCategories = {
  all: Recipe[];
  dairyFree: Recipe[];
  glutenFree: Recipe[];
  vegetarian: Recipe[];
  vegan: Recipe[];
};

type GPPexelsImageType = {
  id: number;
  width: number;
  height: number;
  url: string;
  photographer: string;
  photographer_url: string;
  photographer_id: number;
  avg_color: string;
  src: {
    original: string;
    large2x: string;
    large: string;
    medium: string;
    small: string;
    portrait: string;
    landscape: string;
    tiny: string;
  };
  liked: boolean;
  alt: string;
};

type GPPexelsReturnType = {
  total_results: number;
  page: number;
  per_page: number;
  photos: GPPexelsImageType[];
  next_page: string;
};

type GPImgBBReturnType = {
  data: {
    id: string;
    title: string;
    url_viewer: string;
    url: string;
    display_url: string;
    width: string;
    height: string;
    size: string;
    time: string;
    expiration: string;
    image: {
      filename: string;
      name: string;
      mime: string;
      extension: string;
      url: string;
    };
    thumb: {
      filename: string;
      name: string;
      mime: string;
      extension: string;
      url: string;
    };
    medium: {
      filename: string;
      name: string;
      mime: string;
      extension: string;
      url: string;
    };
    delete_url: string;
  };
  success: boolean;
  status: number;
};

export type {
  GPIngredientDataTypes,
  GPRecipeDataTypes,
  GPEstimateRecipeCostReturnTypes,
  GPErrorMessageTypes,
  GPOwnedIngredientsTypes,
  GPRecipeIngredientTypes,
  GPIngredientApiInfoType,
  GPUserEventTypes,
  GPRecipeEventOptionType,
  GPRecipeDiscoveryCategories,
  GPPexelsImageType,
  GPPexelsReturnType,
  GPImgBBReturnType,
};
