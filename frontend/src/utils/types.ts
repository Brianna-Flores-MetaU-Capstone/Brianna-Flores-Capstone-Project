import type { User } from "firebase/auth";

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
  sourceUrl: string;
  vegetarian: boolean;
  vegan: boolean;
  glutenFree: boolean;
  dairyFree: boolean;
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
  id: number
  ingredientName: string;
  quantity: string;
  unit: string;
  department: string;
  image: string;
  estimatedCost: number;
  expirationDate?: string | null;
};

type GPCurrentUserTypes = {
  user: User;
  userEmail: string;
  userIntolerances: string[];
  userDiets: string[];
};

type GPRequestFormDataTypes = {
  recipeName: string;
  servings: string;
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

export type {
  GPToggleNavBarProps,
  GPAccountInfoTypes,
  GPAuthFormDataTypes,
  GPCurrentUserTypes,
  GPIngredientDataTypes,
  GPRecipeDataTypes,
  GPRequestFormDataTypes,
  GPErrorMessageTypes,
  GPIngredientsOnHandTypes,
};
