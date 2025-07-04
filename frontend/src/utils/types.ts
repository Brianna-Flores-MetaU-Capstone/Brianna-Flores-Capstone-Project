import type { User } from "firebase/auth";

interface GPToggleNavBarProps {
  navOpen: boolean;
  toggleNav: () => void;
}

interface GPRecipeDataTypes {
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
}

interface GPAccountInfoTypes {
  firebaseId: string;
  email: string;
  intolerances: string[];
  diets: string[];
}

interface GPAuthFormDataTypes {
  email: string;
  password: string;
}

interface GPIngredientDataTypes {
  department: string;
  image: string;
  name: string;
  quantity: string;
  unit: string;
  estimatedCost: number;
  expirationDate?: string | null;
}

interface GPCurrentUserTypes {
  user: User;
  userEmail: string;
  userIntolerances: string[];
  userDiets: string[];
}

interface GPRequestFormDataTypes {
  recipeName: string;
  servings: string;
}

export type {
  GPToggleNavBarProps,
  GPAccountInfoTypes,
  GPAuthFormDataTypes,
  GPCurrentUserTypes,
  GPIngredientDataTypes,
  GPRecipeDataTypes,
  GPRequestFormDataTypes,
};
