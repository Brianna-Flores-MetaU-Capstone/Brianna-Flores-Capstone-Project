import type { User } from "firebase/auth";
import TimeBlock from "../../../backend/classes/TimeBlock";

type GPRecipeDataTypes = {
  id: number;
  apiId: number;
  originalSource: string;
  editingAuthorName: string;
  editingAuthorId: number | null;
  recipeTitle: string;
  previewImage: string;
  servings: number;
  ingredients: GPIngredientDataTypes[];
  instructions: string[];
  sourceUrl: string;
  readyInMinutes: number;
  vegetarian: boolean;
  vegan: boolean;
  glutenFree: boolean;
  dairyFree: boolean;
  recipeTags: string[];
  ingredientCostInfo: GPIngredientDataTypes[];
  totalCost: number;
};

type GPAccountInfoTypes = {
  firebaseId: string;
  email: string;
  intolerances: string[];
  diets: string[];
};

type GPAuthFormDataTypes = {
  email: string;
  password: string;
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
  ingredientCostUnit?: number;
};

type GPCurrentUserTypes = {
  user: User;
  userEmail: string;
  userIntolerances: string[];
  userDiets: string[];
};

type GPErrorMessageTypes = {
  error: boolean;
  message: string;
};

type GPOwnedIngredientsTypes = {
  userId: string;
  ingredient: GPIngredientDataTypes;
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
  ingredientCostUnit: number;
};

type GPUserEventTypes = {
  name: string;
  start: Date;
  end: Date;
};

type GPPrepBlockType = {
  recipeTitle: string;
  readyInMinutes: number;
  servings: number;
  previewImage: string;
  sourceUrl: string;
};

type GPRecipeEventOptionType = {
  name: string;
  timeOptions: TimeBlock[];
  recipe: GPRecipeDataTypes | GPPrepBlockType;
};

type GPPreferredBlockType = {
  start: string;
  end: string;
};

type GPRecipeDiscoveryCategories = {
  all: GPRecipeDataTypes[];
  dairyFree: GPRecipeDataTypes[];
  glutenFree: GPRecipeDataTypes[];
  vegetarian: GPRecipeDataTypes[];
  vegan: GPRecipeDataTypes[];
};



export type {
  GPAccountInfoTypes,
  GPAuthFormDataTypes,
  GPCurrentUserTypes,
  GPIngredientDataTypes,
  GPRecipeDataTypes,
  GPErrorMessageTypes,
  GPOwnedIngredientsTypes,
  GPRecipeIngredientTypes,
  GPIngredientApiInfoType,
  GPUserEventTypes,
  GPRecipeEventOptionType,
  GPPreferredBlockType,
  GPRecipeDiscoveryCategories,
};
