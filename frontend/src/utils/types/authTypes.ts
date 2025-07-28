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

export type {
  GPAccountInfoTypes,
  GPCurrentUserTypes,
}