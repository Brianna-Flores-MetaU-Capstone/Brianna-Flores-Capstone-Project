import type {
  GPIngredientDataTypes,
  GPRecipeIngredientTypes,
  GPErrorMessageTypes,
  GPEstimateRecipeCostReturnTypes,
} from "./types/types";
import axios from "axios";
import { axiosConfig, fetchUserIngredientsHelper } from "./databaseHelpers";
import {
  AuthFormData,
  type GPAuthFormType,
} from "../classes/authentication/AuthFormData";
import { Recipe } from "../../../shared/Recipe";
import { MIN_PASSWORD_LENGTH } from "./constants";
import type { GPSpoonacularResultsType } from "./types/spoonacularApiReturnType";
const databaseUrl = import.meta.env.VITE_DATABASE_URL;

const parseRecipeData = async (recipeData: GPSpoonacularResultsType[]) => {
  return await Promise.all(
    recipeData.map(async (recipe: any) => {
      const parsedIngredients = parseIngredients(recipe.extendedIngredients);
      const parsedInstructions = parseInstructions(
        recipe.analyzedInstructions[0].steps,
      );
      const parsedTags = parseTags(recipe);
      const newRecipe = new Recipe(
        recipe.id,
        recipe.sourceName,
        recipe.title,
        [recipe.image],
        recipe.servings,
        parsedIngredients,
        parsedInstructions,
        recipe.sourceUrl,
        recipe.readyInMinutes,
        recipe.vegetarian,
        recipe.vegan,
        recipe.glutenFree,
        recipe.dairyFree,
        parsedTags,
        0,
        null,
      );
      return newRecipe;
    }),
  );
};

const parseTags = (unparsedRecipeData: any) => {
  let recipeTags: string[] = [];
  if (unparsedRecipeData.vegetarian) {
    recipeTags = [...recipeTags, "Vegetarian"];
  }
  if (unparsedRecipeData.vegan) {
    recipeTags = [...recipeTags, "Vegan"];
  }
  if (unparsedRecipeData.dairyFree) {
    recipeTags = [...recipeTags, "Dairy Free"];
  }
  if (unparsedRecipeData.glutenFree) {
    recipeTags = [...recipeTags, "Gluten Free"];
  }
  return recipeTags;
};

const parseIngredients = (ingredientsData: any) => {
  return ingredientsData.map((ingredient: any) => ({
    id: ingredient.id,
    ingredientName: ingredient.name,
    department: ingredient.aisle,
    quantity: ingredient.amount,
    unit: ingredient.unit,
    estimatedCost: getIngredientCost(),
  }));
};

const parseInstructions = (steps: any) => {
  if (steps) {
    return steps.map((step: any) => step.step);
  }
};

const getIngredientCost = () => {
  return 0;
};

type GPEstimateRecipeCostTypes = {
  recipeIngredients: GPRecipeIngredientTypes[];
  ownedIngredients: GPIngredientDataTypes[];
};

const estimateRecipeCost = async ({
  ownedIngredients,
  recipeIngredients,
}: GPEstimateRecipeCostTypes) => {
  try {
    const response = await axios.post<GPEstimateRecipeCostReturnTypes>(
      `${databaseUrl}/generateList/estimateCost`,
      { ownedIngredients, recipeIngredients },
      axiosConfig,
    );
    const estimatedCostFormatted: GPEstimateRecipeCostReturnTypes = {
      ingredientCostInfo: response.data.ingredientCostInfo ?? [],
      estimatedCost: response.data.estimatedCost ?? 0,
    };
    return estimatedCostFormatted;
  } catch (error) {
    console.error("Error estimating cost, send default cost");
    return;
  }
};

const validateInput = (formData: AuthFormData) => {
  if (!formData.email || !formData.password) {
    return { type: "error", text: "Email and password are required" };
  }

  if (formData.password.length < MIN_PASSWORD_LENGTH) {
    return {
      type: "error",
      text: `Password must be at least ${MIN_PASSWORD_LENGTH} characters long`,
    };
  }
  return { type: "", text: "" };
};

const handleAuthInputChange = (
  event: React.ChangeEvent<HTMLInputElement>,
  setFormData: React.Dispatch<React.SetStateAction<AuthFormData>>,
) => {
  const credential = event.target.dataset.credential as GPAuthFormType;
  const value = event.target.value;
  setFormData((prev) => {
    const newAuth = new AuthFormData(prev.getEmail, prev.getPassword);
    newAuth.setAuthField(credential, value);
    return newAuth;
  });
};

const parseGroceryListDepartments = (groceryList: GPIngredientDataTypes[]) => {
  let departments: string[] = [];
  for (const grocery of groceryList) {
    if (!departments.includes(grocery.department)) {
      departments = [...departments, grocery.department];
    }
  }
  return departments;
};

type GPUpdateRecipePricingTypes = {
  setMessage: (
    value: React.SetStateAction<GPErrorMessageTypes | undefined>,
  ) => void;
  recipe: Recipe;
};

const updateRecipeWithPricing = async ({
  setMessage,
  recipe,
}: GPUpdateRecipePricingTypes) => {
  const ownedIngredients =
    (await fetchUserIngredientsHelper({
      setMessage: setMessage,
    })) ?? [];
  const estimatedRecipeCostInfo = await estimateRecipeCost({
    ownedIngredients,
    recipeIngredients: recipe.ingredients,
  });
  recipe.setIngredientCostInfo =
    estimatedRecipeCostInfo?.ingredientCostInfo ?? [];
  recipe.setTotalCost = estimatedRecipeCostInfo?.estimatedCost ?? 0;
  return recipe;
};

const formatQuantity = (ingredientQuantity: number) => {
  return ingredientQuantity % 1 === 0
    ? ingredientQuantity
    : Number(ingredientQuantity.toString()).toFixed(2);
};

export {
  validateInput,
  parseRecipeData,
  handleAuthInputChange,
  parseGroceryListDepartments,
  estimateRecipeCost,
  updateRecipeWithPricing,
  formatQuantity,
};
