import type { GPErrorMessageTypes, GPIngredientDataTypes } from "./types/types";

import type {
  GPCurrentUserTypes,
  GPAccountInfoTypes,
  GPUserDatabaseReturnType,
  GPUserAccountType,
} from "./types/authTypes";
import type { User } from "firebase/auth";
import { parseGroceryListDepartments } from "./utils";
import axios from "axios";
import { Recipe } from "../../../shared/Recipe";
import { CalendarEvent } from "../classes/calendar/CalendarEvent";
import { ALERT_TIMEOUT, RecipeFetchEnum } from "./constants";
import { IngredientData } from "../../../shared/IngredientData";
import { recipeFiltersList } from "../classes/filters/RecipeFilters";

const databaseUrl = import.meta.env.VITE_DATABASE_URL;

const axiosConfig = {
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
};

type GPSetMessageType = {
  setMessage: (
    value: React.SetStateAction<GPErrorMessageTypes | undefined>,
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
    setTimeout(() => {
      setMessage(undefined);
    }, ALERT_TIMEOUT);
  }
};

type GPUserDataHelperTypes = GPSetMessageType & {
  user: User;
};
const getUserData = async ({ user, setMessage }: GPUserDataHelperTypes) => {
  try {
    const response = await axios.get<GPUserDatabaseReturnType>(
      `${databaseUrl}/account/${user.uid}`,
      axiosConfig,
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
    setTimeout(() => {
      setMessage(undefined);
    }, ALERT_TIMEOUT);
  }
};

type GPNewUserHelperTypes = GPSetMessageType & {
  newUser: GPAccountInfoTypes;
};
const handleNewUser = async ({ newUser, setMessage }: GPNewUserHelperTypes) => {
  try {
    const response = await axios.post<GPUserAccountType>(
      `${databaseUrl}/signup`,
      newUser,
      axiosConfig,
    );
    return response.data;
  } catch (error) {
    setMessage({ error: true, message: "Failed to add user to database" });
    setTimeout(() => {
      setMessage(undefined);
    }, ALERT_TIMEOUT);
  }
};

const validateUserToken = async (user: User) => {
  const token = await user.getIdToken(true);
  try {
    const response = await axios.post(
      `${databaseUrl}/login`,
      { token },
      axiosConfig,
    );
    return response.data;
  } catch (error) {
    return null;
  }
};

const fetchUserIngredientsHelper = async ({ setMessage }: GPSetMessageType) => {
  try {
    const response = await axios.get<GPIngredientDataTypes[]>(
      `${databaseUrl}/ingredients`,
      axiosConfig,
    );
    const userIngredients = response.data.map(
      (ingredient) =>
        new IngredientData(
          ingredient.id,
          ingredient.ingredientName,
          ingredient.quantity,
          ingredient.unit,
          ingredient.department,
          ingredient.isChecked,
          ingredient.expirationDate,
        ),
    );
    return userIngredients;
  } catch (error) {
    setMessage({
      error: true,
      message: "Error displaying user ingredients",
    });
    setTimeout(() => {
      setMessage(undefined);
    }, ALERT_TIMEOUT);
  }
};

type GPDeleteUserIngredientTypes = GPSetMessageType & {
  ingredient: IngredientData;
};
const deleteIngredient = async ({
  setMessage,
  ingredient,
}: GPDeleteUserIngredientTypes) => {
  try {
    await axios.delete(
      `${databaseUrl}/ingredients/${ingredient.id}`,
      axiosConfig,
    );
    setMessage({ error: false, message: "Sucessfully deleted ingredient" });
    setTimeout(() => {
      setMessage(undefined);
    }, ALERT_TIMEOUT);
  } catch (error) {
    setMessage({ error: true, message: "Failed to delete ingredient" });
    setTimeout(() => {
      setMessage(undefined);
    }, ALERT_TIMEOUT);
  }
};

type GPAddIngredientTypes = {
  userId: string;
  newIngredientData: IngredientData;
};

const addIngredientDatabase = async ({
  userId,
  newIngredientData,
}: GPAddIngredientTypes) => {
  try {
    await axios.post(
      `${databaseUrl}/ingredients/${userId}`,
      newIngredientData,
      axiosConfig,
    );
    return true;
  } catch (error) {
    return false;
  }
};

type GPUpdateIngredientTypes = GPSetMessageType & {
  ingredientId: number | undefined;
  newIngredientData: IngredientData;
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
      axiosConfig,
    );
    setMessage({ error: false, message: "Sucessfully updated ingredient" });
    setTimeout(() => {
      setMessage(undefined);
    }, ALERT_TIMEOUT);
  } catch (error) {
    setMessage({ error: true, message: "Failed to update ingredient" });
    setTimeout(() => {
      setMessage(undefined);
    }, ALERT_TIMEOUT);
  }
};

type GPFetchRecipeTypes = GPSetMessageType & {
  setRecipes?: (value: React.SetStateAction<Recipe[]>) => void;
  recipeGroup: string;
};
const fetchRecipes = async ({
  setMessage,
  setRecipes,
  recipeGroup,
}: GPFetchRecipeTypes) => {
  try {
    const response = await axios.get<Recipe[]>(
      `${databaseUrl}/recipes/${recipeGroup}`,
      axiosConfig,
    );
    if (recipeGroup === RecipeFetchEnum.FAVORITED_IDS) {
      return response.data;
    }
    const recipesWithCalendarInfo = response.data.map((recipe: Recipe) => {
      return new Recipe(
        recipe.apiId,
        recipe.originalSource,
        recipe.recipeTitle,
        recipe.previewImage,
        recipe.servings,
        recipe.ingredients,
        recipe.instructions,
        recipe.sourceUrl,
        recipe.readyInMinutes,
        recipe.vegetarian,
        recipe.vegan,
        recipe.glutenFree,
        recipe.dairyFree,
        recipe.recipeTags,
        recipe.likes,
        recipe.editingAuthorId,
        recipe.id,
        recipe.editingAuthorName,
        [],
        0,
        recipe.calendarEvents?.map((eventInfo: any) => {
          return new CalendarEvent(
            eventInfo.eventTitle,
            eventInfo.start.toString(),
            eventInfo.end.toString(),
            eventInfo.eventLink,
          );
        }),
      );
    });
    if (setRecipes) {
      setRecipes(recipesWithCalendarInfo);
    }
    return recipesWithCalendarInfo;
  } catch (error) {
    setMessage({ error: true, message: "Failed to fetch user recipes" });
    setTimeout(() => {
      setMessage(undefined);
    }, ALERT_TIMEOUT);
  }
};

type GPUpdateUserRecipesTypes = GPSetMessageType & {
  editedRecipe: boolean;
  selectedRecipe: Recipe;
  userId: string;
};
const updateUserRecipes = async ({
  editedRecipe,
  userId,
  selectedRecipe,
  setMessage,
}: GPUpdateUserRecipesTypes) => {
  try {
    await axios.post(
      `${databaseUrl}/recipes/${RecipeFetchEnum.PLANNED}/${userId}`,
      { editedRecipe: editedRecipe, ...selectedRecipe },
      axiosConfig,
    );
  } catch (error) {
    setMessage({ error: true, message: "Failed to save recipe" });
    setTimeout(() => {
      setMessage(undefined);
    }, ALERT_TIMEOUT);
  }
};

type GPFetchGroceryListTypes = GPSetMessageType & {
  setUserGroceryList: (value: React.SetStateAction<IngredientData[]>) => void;
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
    const response = await axios.get<{
      groceryList: IngredientData[];
      groceryListCost: number;
    }>(`${databaseUrl}/generateList`, axiosConfig);
    setUserGroceryList(response.data.groceryList);
    if (setGroceryDepartments) {
      const departments = parseGroceryListDepartments(
        response.data.groceryList,
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
  setTotalNumRecipes: (value: React.SetStateAction<number>) => void;
  filter: string;
  offset: number;
  numRequested: number;
};
const fetchDiscoverRecipes = async ({
  setMessage,
  setTotalNumRecipes,
  filter,
  offset,
  numRequested,
}: GPFetchDiscoverRecipesType) => {
  try {
    const numRecipes = await axios.post<number>(
      `${databaseUrl}/recipes/totalNumRecipes`,
      { filter },
      axiosConfig,
    );
    setTotalNumRecipes(numRecipes.data);
    const response = await axios.post<Recipe[]>(
      `${databaseUrl}/recipes/discover`,
      { filter, offset, numRequested },
      axiosConfig,
    );
    return response.data;
  } catch (error) {
    setMessage({
      error: true,
      message: `Error fetching ${filter} recipes`,
    });
  }
};

type GPFetchPopularRecipesType = GPSetMessageType & {
  setTotalNumRecipes: (value: React.SetStateAction<number>) => void;
  offset: number;
  numRequested: number;
};
const fetchPopularRecipes = async ({
  setMessage,
  setTotalNumRecipes,
  offset,
  numRequested,
}: GPFetchPopularRecipesType) => {
  try {
    const response = await axios.post<Recipe[]>(
      `${databaseUrl}/recipes/popular`,
      { offset, numRequested },
      axiosConfig,
    );
    const numRecipes = await axios.post<number>(
      `${databaseUrl}/recipes/totalNumRecipes`,
      { filter: recipeFiltersList.ALL },
      axiosConfig,
    );
    setTotalNumRecipes(numRecipes.data);
    return response.data;
  } catch (error) {
    setMessage({
      error: true,
      message: `Error fetching popular recipes`,
    });
  }
};

type GPUnfavoriteType = GPSetMessageType & {
  recipe: Recipe;
};

const handleUnfavoriteRecipe = async ({
  setMessage,
  recipe,
}: GPUnfavoriteType) => {
  try {
    await axios.put(
      `${databaseUrl}/recipes/${RecipeFetchEnum.FAVORITED}/unfavorite`,
      { selectedRecipe: recipe },
      axiosConfig,
    );
  } catch (error) {
    setMessage({ error: true, message: "Error unfavoriting recipe" });
    setTimeout(() => {
      setMessage(undefined);
    }, ALERT_TIMEOUT);
  }
};

type GPFavoriteType = GPSetMessageType & {
  userId: string;
  selectedRecipe: Recipe;
};

const handleFavoriteRecipe = async ({
  setMessage,
  userId,
  selectedRecipe,
}: GPFavoriteType) => {
  try {
    await axios.post(
      `${databaseUrl}/recipes/${RecipeFetchEnum.FAVORITED}/${userId}`,
      { selectedRecipe },
      axiosConfig,
    );
  } catch (error) {
    setMessage({ error: true, message: "Error favoriting recipe" });
    setTimeout(() => {
      setMessage(undefined);
    }, ALERT_TIMEOUT);
  }
};

type GPFetchSingleRecipeType = GPSetMessageType & {
  selectedRecipe: Recipe;
};

const fetchSingleRecipe = async ({
  setMessage,
  selectedRecipe,
}: GPFetchSingleRecipeType) => {
  try {
    const originalRecipe = await axios.get<Recipe>(
      `${databaseUrl}/recipes/original/${selectedRecipe.apiId}`,
      axiosConfig,
    );
    return originalRecipe.data;
  } catch (error) {
    setMessage({ error: true, message: "Error fetching original recipe" });
  }
};

type GPSaveCalendarEventType = GPSetMessageType & {
  selectedRecipe: Recipe;
  calendarEvent: CalendarEvent;
};

const saveCalendarEvent = async ({
  setMessage,
  selectedRecipe,
  calendarEvent,
}: GPSaveCalendarEventType) => {
  try {
    const savedCalendarEvent = await axios.post(
      `${databaseUrl}/calendar/createEvent`,
      { selectedRecipe, ...calendarEvent },
      axiosConfig,
    );
    return savedCalendarEvent.data;
  } catch (error) {
    setMessage({ error: true, message: "Failed to save event to database" });
    setTimeout(() => {
      setMessage(undefined);
    }, ALERT_TIMEOUT);
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
  fetchDiscoverRecipes,
  fetchPopularRecipes,
  handleUnfavoriteRecipe,
  handleFavoriteRecipe,
  fetchSingleRecipe,
  saveCalendarEvent,
  axiosConfig,
};
