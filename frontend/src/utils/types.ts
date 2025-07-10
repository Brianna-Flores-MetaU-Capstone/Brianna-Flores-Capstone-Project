import type { User } from "firebase/auth";
import type { GPIngredientPriceInfoTypes } from "../../../backend/utils/utils";

type GPToggleNavBarProps = {
  navOpen: boolean;
  toggleNav: () => void;
};

type GPRecipeDataTypes = {
  apiId: number;
  recipeTitle: string;
  previewImage: string;
  servings: number;
  ingredients: GPIngredientDataTypes[];
  instructions: string[];
  sourceUrl: string;
  vegetarian: boolean;
  vegan: boolean;
  glutenFree: boolean;
  dairyFree: boolean;
  ingredientPriceInfo: GPIngredientPriceInfoTypes[];
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
  estimatedCost: number;
  expirationDate?: string | null;
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

type GPIngredientsOnHandTypes = {
  userId: string;
  ingredient: GPIngredientDataTypes;
  ingredientId: string;
};

type GPRecipeIngredientTypes = {
  id: number;
  unit: string;
  quantity: number;
  department: string;
  estimatedCost: number;
  ingredientName: string;
};

export type {
  GPToggleNavBarProps,
  GPAccountInfoTypes,
  GPAuthFormDataTypes,
  GPCurrentUserTypes,
  GPIngredientDataTypes,
  GPRecipeDataTypes,
  GPErrorMessageTypes,
  GPIngredientsOnHandTypes,
  GPRecipeIngredientTypes,
};
