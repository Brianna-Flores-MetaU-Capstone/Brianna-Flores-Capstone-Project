import type { User } from "firebase/auth";

type GPToggleNavBarProps = {
  navOpen: boolean;
  toggleNav: () => void;
};

type GPRecipeDataTypes = {
  id: number;
  image: string;
  title: string;
  servings: number;
  sourceUrl: string;
  vegetarian: boolean;
  vegan: boolean;
  glutenFree: boolean;
  dairyFree: boolean;
  ingredients: GPIngredientDataTypes[];
  totalEstimatedCost: number;
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
  department: string;
  image: string;
  name: string;
  quantity: string;
  unit: string;
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

export type {
  GPToggleNavBarProps,
  GPAccountInfoTypes,
  GPAuthFormDataTypes,
  GPCurrentUserTypes,
  GPIngredientDataTypes,
  GPRecipeDataTypes,
  GPRequestFormDataTypes,
  GPErrorMessageTypes,
};
