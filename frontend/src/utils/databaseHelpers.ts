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
import axios from "axios";

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
  try {
    const body = {
      email: userEmail,
      intolerances: userIntolerances,
      diets: userDiets,
    };
    await axios.put(`${databaseUrl}/account/${user.uid}`, body, {
      headers: {
        "Content-Type": "application/json",
      },
      withCredentials: true,
    });
  } catch (error) {
    setMessage({ error: true, message: "Failed to update user" });
  }
};

type GPUserDataHelperTypes = GPSetMessageType & {
  user: User;
};
const getUserData = async ({ user, setMessage }: GPUserDataHelperTypes) => {
  try {
    const response = await axios.get(`${databaseUrl}/account/${user.uid}`, {
      headers: {
        "Content-Type": "application/json",
      },
      withCredentials: true,
    });
    const userDataObj: GPCurrentUserTypes = {
      user,
      userEmail: response.data.email,
      userIntolerances: response.data.intolerances,
      userDiets: response.data.diets,
    };
    return userDataObj;
  } catch (error) {
    setMessage({ error: true, message: "Failed to get user data" });
  }
};

type GPNewUserHelperTypes = GPSetMessageType & {
  newUser: GPAccountInfoTypes;
};
const handleNewUser = async ({ newUser, setMessage }: GPNewUserHelperTypes) => {
  try {
    const response = await axios.post(`${databaseUrl}/signup`, newUser, {
      headers: {
        "Content-Type": "application/json",
      },
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    setMessage({ error: true, message: "Failed to add user to database" });
  }
};

const validateUserToken = async (user: User) => {
  const token = await user.getIdToken(true);
  try {
    await axios.post(
      `${databaseUrl}/login`,
      { token },
      {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      }
    );
    return true;
  } catch (error) {
    return false;
  }
};

const fetchUserIngredientsHelper = async ({ setMessage }: GPSetMessageType) => {
  try {
    const response = await axios.get(`${databaseUrl}/ingredients`, {
      withCredentials: true,
    });
    return response.data;
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
  try {
    await axios.delete(`${databaseUrl}/ingredients/${ingredient.id}`, {
      headers: {
        "Content-Type": "application/json",
      },
      withCredentials: true,
    });
    setMessage({ error: false, message: "Sucessfully deleted ingredient" });
  } catch (error) {
    setMessage({ error: true, message: "Failed to delete ingredient" });
  }
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
  try {
    await axios.post(
      `${databaseUrl}/ingredients/${userId}`,
      newIngredientData,
      {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      }
    );
    setMessage({ error: false, message: "Sucessfully created ingredient" });
  } catch (error) {
    setMessage({ error: true, message: "Failed to create ingredient" });
  }
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
  try {
    await axios.put(
      `${databaseUrl}/ingredients/${ingredientId}`,
      newIngredientData,
      {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      }
    );
    setMessage({ error: false, message: "Sucessfully updated ingredient" });
  } catch (error) {
    setMessage({ error: true, message: "Failed to update ingredient" });
  }
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
    const response = await axios.get(`${databaseUrl}/recipes`, {
      withCredentials: true,
    });
    setSelectedRecipes(response.data);
    return response.data;
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
  try {
    await axios.post(`${databaseUrl}/recipes/${userId}`, selectedRecipe, {
      headers: {
        "Content-Type": "application/json",
      },
      withCredentials: true,
    });
    setMessage({ error: false, message: "Sucessfully saved recipe" });
  } catch (error) {
    setMessage({ error: true, message: "Failed to save recipe" });
  }
};

type GPFetchGroceryListTypes = GPSetMessageType & {
  setUserGroceryList: (
    value: React.SetStateAction<GPRecipeIngredientTypes[]>
  ) => void;
  setGroceryDepartments?: (value: React.SetStateAction<string[]>) => void;
  setGroceryListPrice?: (value: React.SetStateAction<number>) => void;
};
const fetchGroceryList = async ({
  setMessage,
  setUserGroceryList,
  setGroceryDepartments,
  setGroceryListPrice,
}: GPFetchGroceryListTypes) => {
  try {
    const response = await axios.get(`${databaseUrl}/generateList`, {
      withCredentials: true,
    });
    setUserGroceryList(response.data.groceryList);
    if (setGroceryDepartments) {
      const departments = parseGroceryListDepartments(
        response.data.groceryList
      );
      setGroceryDepartments(departments);
    }
    if (setGroceryListPrice) {
      setGroceryListPrice(response.data.groceryListPrice);
    }
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
  fetchGroceryList,
};
