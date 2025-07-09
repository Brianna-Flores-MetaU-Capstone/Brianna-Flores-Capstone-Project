import type {
  GPCurrentUserTypes,
  GPAccountInfoTypes,
  GPErrorMessageTypes,
  GPIngredientDataTypes,
  GPRecipeDataTypes,
  GPRecipeIngredientTypes,
} from "./types";
import type { User } from "firebase/auth";
import { parseGroceryListDepartments } from "./utils";

const databaseUrl = import.meta.env.VITE_DATABASE_URL;

type GPSetMessageType = {
  setMessage: (
    value: React.SetStateAction<GPErrorMessageTypes | undefined>
  ) => void;
};

type GPUpdateAccountHelperTypes = GPCurrentUserTypes & GPSetMessageType;
const updateAccount = async ({
  user,
  userEmail,
  userIntolerances,
  userDiets,
  setMessage,
}: GPUpdateAccountHelperTypes) => {
  const updatedUser = await fetch(`${databaseUrl}/account/${user.uid}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: userEmail,
      intolerances: userIntolerances,
      diets: userDiets,
    }),
    credentials: "include",
  });
  if (!updatedUser.ok) {
    setMessage({ error: true, message: "Failed to update user" });
  }
  const data = await updatedUser.json();
  return data;
};

type GPUserDataHelperTypes = GPSetMessageType & {
  user: User;
};
const getUserData = async ({ user, setMessage }: GPUserDataHelperTypes) => {
  try {
    const fetchedUserData = await fetch(`${databaseUrl}/account/${user.uid}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });
    if (!fetchedUserData.ok) {
      setMessage({ error: true, message: "Failed to get user data" });
    }
    const data = await fetchedUserData.json();
    const userDataObj: GPCurrentUserTypes = {
      user,
      userEmail: data.email,
      userIntolerances: data.intolerances,
      userDiets: data.diets,
    };
    return userDataObj;
  } catch (error) {
    // TODO use error state
    console.error(error);
  }
};

type GPNewUserHelperTypes = GPSetMessageType & {
  newUser: GPAccountInfoTypes;
};
const handleNewUser = async ({ newUser, setMessage }: GPNewUserHelperTypes) => {
  try {
    const response = await fetch(`${databaseUrl}/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newUser),
      credentials: "include",
    });
    if (!response.ok) {
      setMessage({ error: true, message: "Failed to add user to database" });
    }
    const data = await response.json();
    return data;
  } catch (error) {
    // TODO use error state
    console.error(error);
  }
};

const validateUserToken = async (user: User) => {
  const token = await user.getIdToken(true);
  const response = await fetch(`${databaseUrl}/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ token }),
    credentials: "include",
  });
  if (!response.ok) {
    return false;
  }
  return true;
};

const fetchUserIngredientsHelper = async ({ setMessage }: GPSetMessageType) => {
  try {
    const response = await fetch(`${databaseUrl}/ingredients`, {
      method: "GET",
      credentials: "include",
    });
    if (!response.ok) {
      setMessage({
        error: true,
        message: "Error displaying user ingredients",
      });
      return;
    }
    const data = await response.json();
    return data;
  } catch (error) {
    setMessage({
      error: true,
      message: "Error displaying user ingredients",
    });
  }
};

type GPDeleteUserIngredientTypes = GPSetMessageType & {
  ingredient: GPIngredientDataTypes;
};
const deleteIngredient = async ({
  setMessage,
  ingredient,
}: GPDeleteUserIngredientTypes) => {
  const response = await fetch(`${databaseUrl}/ingredients/${ingredient.id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  });
  if (!response.ok) {
    setMessage({ error: true, message: "Failed to delete ingredient" });
    return;
  }
  setMessage({ error: false, message: "Sucessfully deleted ingredient" });
};

type GPAddIngredientTypes = GPSetMessageType & {
  userId: string;
  newIngredientData: GPIngredientDataTypes;
};

const addIngredientDatabase = async ({
  userId,
  newIngredientData,
  setMessage,
}: GPAddIngredientTypes) => {
  const response = await fetch(`${databaseUrl}/ingredients/${userId}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(newIngredientData),
    credentials: "include",
  });
  if (!response.ok) {
    setMessage({ error: true, message: "Failed to create ingredient" });
    return;
  }
  setMessage({ error: false, message: "Sucessfully created ingredient" });
};

type GPUpdateIngredientTypes = GPSetMessageType & {
  ingredientId: number | undefined;
  newIngredientData: GPIngredientDataTypes;
};
const updateIngredientDatabase = async ({
  ingredientId,
  newIngredientData,
  setMessage,
}: GPUpdateIngredientTypes) => {
  const response = await fetch(`${databaseUrl}/ingredients/${ingredientId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(newIngredientData),
    credentials: "include",
  });
  if (!response.ok) {
    setMessage({ error: true, message: "Failed to update ingredient" });
    return;
  }
  setMessage({ error: false, message: "Sucessfully updated ingredient" });
};

type GPFetchRecipeTypes = GPSetMessageType & {
  setSelectedRecipes: (
    value: React.SetStateAction<GPRecipeDataTypes[]>
  ) => void;
};
const fetchRecipes = async ({
  setMessage,
  setSelectedRecipes,
}: GPFetchRecipeTypes) => {
  try {
    const response = await fetch(`${databaseUrl}/recipes`, {
      method: "GET",
      credentials: "include",
    });
    if (!response.ok) {
      setMessage({ error: true, message: "Failed to fetch user recipes" });
      return;
    }
    const data = await response.json();
    setSelectedRecipes(data);
    return data;
  } catch (error) {
    setMessage({ error: true, message: "Failed to fetch user recipes" });
  }
};

type GPUpdateUserRecipesTypes = GPSetMessageType & {
  selectedRecipe: GPRecipeDataTypes;
  userId: string;
};
const updateUserRecipes = async ({
  userId,
  selectedRecipe,
  setMessage,
}: GPUpdateUserRecipesTypes) => {
  const response = await fetch(`${databaseUrl}/recipes/${userId}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(selectedRecipe),
    credentials: "include",
  });
  if (!response.ok) {
    setMessage({ error: true, message: "Failed to save recipe" });
    return;
  }
  setMessage({ error: false, message: "Sucessfully saved recipe" });
};

type GPFetchGroceryListTypes = GPSetMessageType & {
  setUserGroceryList:  (
    value: React.SetStateAction<GPRecipeIngredientTypes[]>
  ) => void
  setGroceryDepartments: (
    value: React.SetStateAction<string[]>
  ) => void
};
const fetchGroceryList = async ({setMessage, setUserGroceryList, setGroceryDepartments}: GPFetchGroceryListTypes) => {
    try {
      const response = await fetch(`${databaseUrl}/generateList`, {
        method: "GET",
        credentials: "include",
      });
      if (!response.ok) {
        setMessage({
          error: true,
          message: "Error failed to fetch user grocery list",
        });
        return
      }
      const data = await response.json();
      setUserGroceryList(data);
      const departments = parseGroceryListDepartments(data)
      setGroceryDepartments(departments)
    } catch (error) {
      setMessage({
        error: true,
        message: "Error failed to fetch user grocery list",
      });
    }
  };

export {
  updateAccount,
  getUserData,
  handleNewUser,
  validateUserToken,
  fetchUserIngredientsHelper,
  deleteIngredient,
  addIngredientDatabase,
  updateIngredientDatabase,
  fetchRecipes,
  updateUserRecipes,
  fetchGroceryList
};
