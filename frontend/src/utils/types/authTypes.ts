import type { User } from "firebase/auth";

type GPAccountInfoTypes = {
  firebaseId: string;
  email: string;
  intolerances: string[];
  diets: string[];
};

type GPCurrentUserTypes = {
  user: User;
  userEmail: string;
  userIntolerances: string[];
  userDiets: string[];
};

type GPUserDatabaseReturnType = {
    id: number;
    firebaseId: string;
    email: string;
    userName: string
    intolerances: string[];
    diets: string[]
    groceryList: JSON | null;
    groceryListCost: number
}

type GPUserAccountType = {
  id: string;
  userName: string;
  intolerances: string[];
  diets: string[];
};

export type { GPAccountInfoTypes, GPCurrentUserTypes, GPUserDatabaseReturnType, GPUserAccountType };
