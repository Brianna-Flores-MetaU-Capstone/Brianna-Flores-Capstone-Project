import type {
  GPCurrentUserTypes,
  GPAccountInfoTypes,
  GPErrorMessageTypes,
  GPIngredientDataTypes,
  GPRecipeDataTypes,
  GPRecipeDiscoveryCategories,
} from "./types";
import type { User } from "firebase/auth";
import { parseGroceryListDepartments } from "./utils";
import axios from "axios";

const databaseUrl = import.meta.env.VITE_DATABASE_URL;
const DISCOVERY_NUM_TO_REQUEST = 20;

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
  setRecipes: (
    value: React.SetStateAction<GPRecipeDataTypes[]>
  ) => void;
  recipeGroup: string;
};
const fetchRecipes = async ({
  setMessage,
  setRecipes,
  recipeGroup
}: GPFetchRecipeTypes) => {
  try {
    const response = await axios.get(`${databaseUrl}/recipes/${recipeGroup}`, axiosConfig);
    setRecipes(response.data);
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
      `${databaseUrl}/recipes/planned/${userId}`,
      selectedRecipe,
      axiosConfig
    );
  } catch (error) {
    setMessage({ error: true, message: "Failed to save recipe" });
  }
};

type GPFetchGroceryListTypes = GPSetMessageType & {
  setUserGroceryList: (
    value: React.SetStateAction<GPIngredientDataTypes[]>
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

type GPFetchDiscoverRecipesType = GPSetMessageType & {
  filter: string;
  offset: number;
  numRequested: number;
};
const fetchDiscoverRecipes = async ({
  setMessage,
  filter,
  offset,
  numRequested,
}: GPFetchDiscoverRecipesType) => {
  try {
    const response = await axios.post(
      `${databaseUrl}/recipes/discover`,
      { filter, offset, numRequested },
      axiosConfig
    );
    return response.data;
  } catch (error) {
    setMessage({
      error: true,
      message: `Error fetching ${filter} recipes`,
    });
  }
};

type GPFetchRecipeCategoryType = GPSetMessageType & {
  setRecipeDiscoveryResults: (
    value: React.SetStateAction<GPRecipeDiscoveryCategories>
  ) => void;
  filters: { filter: string; title: string }[];
  offset: number;
};
const fetchAllRecipeCategories = async ({
  setMessage,
  setRecipeDiscoveryResults,
  filters,
  offset,
}: GPFetchRecipeCategoryType) => {
  try {
    const recipeCategories: GPRecipeDiscoveryCategories = {
      all: [],
      dairyFree: [],
      glutenFree: [],
      vegetarian: [],
      vegan: [],
    };
    await Promise.all(
      filters.map(async (filter: { filter: string; title: string }) => {
        const categoryRecipes = await fetchDiscoverRecipes({
          setMessage,
          filter: filter.filter,
          offset,
          numRequested: DISCOVERY_NUM_TO_REQUEST,
        });
        recipeCategories[filter.filter as keyof GPRecipeDiscoveryCategories] =
          categoryRecipes;
      })
    );
    setRecipeDiscoveryResults(recipeCategories);
  } catch (error) {
    setMessage({
      error: true,
      message: "Error fetching recipes",
    });
  }
};

type GPUnfavoriteType = GPSetMessageType & {
  recipe: GPRecipeDataTypes
}

const handleUnfavoriteRecipe = async ({setMessage, recipe}: GPUnfavoriteType) => {
  try {
  await axios.put(
        `${databaseUrl}/recipes/favorited/${recipe.apiId}`,
        {},
        axiosConfig
      );
    } catch (error) {
      setMessage({error: true, message: "Error unfavoriting recipe"})
    }
}

const handleFavoriteRecipe = async ({setMessage, userId, selectedRecipe}: GPUpdateUserRecipesTypes) => {
  try {
  await axios.post(
        `${databaseUrl}/recipes/favorited/${userId}`,
        {apiId: selectedRecipe.apiId},
        axiosConfig
      );
    } catch (error) {
      setMessage({error: true, message: "Error favoriting recipe"})
    }
}

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
  fetchDiscoverRecipes,
  fetchAllRecipeCategories,
  handleUnfavoriteRecipe,
  handleFavoriteRecipe,
  axiosConfig,
};
