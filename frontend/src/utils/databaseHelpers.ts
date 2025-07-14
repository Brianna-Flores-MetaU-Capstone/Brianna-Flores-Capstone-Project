import type {
  GPCurrentUserTypes,
  GPAccountInfoTypes,
  GPErrorMessageTypes,
  GPIngredientDataTypes,
  GPRecipeDataTypes,
  GPIngredientWithCostInfoTypes,
} from "./types";
import type { User } from "firebase/auth";
import { parseGroceryListDepartments } from "./utils";
import axios from "axios";

const databaseUrl = import.meta.env.VITE_DATABASE_URL;

const axiosConfig = {
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
};

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
    await axios.put(`${databaseUrl}/account/${user.uid}`, body, axiosConfig);
  } catch (error) {
    setMessage({ error: true, message: "Failed to update user" });
  }
};

type GPUserDataHelperTypes = GPSetMessageType & {
  user: User;
};
const getUserData = async ({ user, setMessage }: GPUserDataHelperTypes) => {
  try {
    const response = await axios.get(
      `${databaseUrl}/account/${user.uid}`,
      axiosConfig
    );
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
    const response = await axios.post(
      `${databaseUrl}/signup`,
      newUser,
      axiosConfig
    );
    return response.data;
  } catch (error) {
    setMessage({ error: true, message: "Failed to add user to database" });
  }
};

const validateUserToken = async (user: User) => {
  const token = await user.getIdToken(true);
  try {
    const response = await axios.post(
      `${databaseUrl}/login`,
      { token },
      axiosConfig
    );
    return response.data;
  } catch (error) {
    return null;
  }
};

const fetchUserIngredientsHelper = async ({ setMessage }: GPSetMessageType) => {
  try {
    const response = await axios.get(`${databaseUrl}/ingredients`, axiosConfig);
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
    await axios.delete(
      `${databaseUrl}/ingredients/${ingredient.id}`,
      axiosConfig
    );
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
      axiosConfig
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
      axiosConfig
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
    const response = await axios.get(`${databaseUrl}/recipes`, axiosConfig);
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
    await axios.post(
      `${databaseUrl}/recipes/${userId}`,
      selectedRecipe,
      axiosConfig
    );
    setMessage({ error: false, message: "Sucessfully saved recipe" });
  } catch (error) {
    setMessage({ error: true, message: "Failed to save recipe" });
  }
};

type GPFetchGroceryListTypes = GPSetMessageType & {
  setUserGroceryList: (
    value: React.SetStateAction<GPIngredientWithCostInfoTypes[]>
  ) => void;
  setGroceryDepartments?: (value: React.SetStateAction<string[]>) => void;
  setGroceryListCost?: (value: React.SetStateAction<number>) => void;
};
const fetchGroceryList = async ({
  setMessage,
  setUserGroceryList,
  setGroceryDepartments,
  setGroceryListCost,
}: GPFetchGroceryListTypes) => {
  try {
    const response = await axios.get(
      `${databaseUrl}/generateList`,
      axiosConfig
    );
    setUserGroceryList(response.data.groceryList);
    if (setGroceryDepartments) {
      const departments = parseGroceryListDepartments(
        response.data.groceryList
      );
      setGroceryDepartments(departments);
    }
    if (setGroceryListCost) {
      setGroceryListCost(response.data.groceryListCost);
    }
  } catch (error) {
    setMessage({
      error: true,
      message: "Grocery list not yet generated",
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
  axiosConfig,
};
