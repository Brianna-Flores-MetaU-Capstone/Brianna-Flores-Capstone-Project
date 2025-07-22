import type {
  GPIngredientDataTypes,
  GPRecipeDataTypes,
  GPRecipeIngredientTypes,
  GPErrorMessageTypes,
} from "./types";
import axios from "axios";
import { axiosConfig, fetchUserIngredientsHelper } from "./databaseHelpers";
import { AuthFormData, type GPAuthFormType } from "../classes/authentication/AuthFormData";

const databaseUrl = import.meta.env.VITE_DATABASE_URL;

const parseRecipeData = async (recipeData: any) => {
  return await Promise.all(
    recipeData.map(async (recipe: any) => {
      const parsedIngredinets = parseIngredients(recipe.extendedIngredients);
      const parsedInstructions = parseInstructions(
        recipe.analyzedInstructions[0].steps
      );
      const parsedTags = parseTags(recipe);
      return {
        apiId: recipe.id,
        originalSource: recipe.sourceName,
        editingAuthorName: "",
        editingAuthorId: null,
        recipeTitle: recipe.title,
        previewImage: recipe.image,
        servings: recipe.servings,
        ingredients: parsedIngredinets,
        instructions: parsedInstructions,
        sourceUrl: recipe.sourceUrl,
        readyInMinutes: recipe.readyInMinutes,
        vegetarian: recipe.vegetarian,
        vegan: recipe.vegan,
        glutenFree: recipe.glutenFree,
        dairyFree: recipe.dairyFree,
        recipeTags: parsedTags,
        ingredientCostInfo: [],
        totalCost: 0,
        isChecked: false,
      };
    })
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
    estimatedCost: getIngredientCost(ingredient.name),
  }));
};

const parseInstructions = (steps: any) => {
  if (steps) {
    return steps.map((step: any) => step.step);
  }
};

const getIngredientCost = (ingredientName: string) => {
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
    const response = await axios.post(
      `${databaseUrl}/generateList/estimateCost`,
      { ownedIngredients, recipeIngredients },
      axiosConfig
    );
    return response.data;
  } catch (error) {
    console.error("Error estimating cost, send default cost");
    return;
  }
};

const validateInput = (formData: AuthFormData) => {
  if (!formData.email || !formData.password) {
    return { type: "error", text: "Email and password are required" };
  }

  if (formData.password.length < 8) {
    return {
      type: "error",
      text: "Password must be at least 8 characters long",
    };
  }
  return { type: "", text: "" };
};

const handleAuthInputChange = (
  event: React.ChangeEvent<HTMLInputElement>,
  setFormData: React.Dispatch<React.SetStateAction<AuthFormData>>
) => {
  const credential = event.target.dataset
    .credential as GPAuthFormType;
  const value = event.target.value;
  setFormData((prev) => {
    const newAuth = new AuthFormData(prev.getEmail, prev.getPassword)
    newAuth.setAuthField(credential, value)
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
    value: React.SetStateAction<GPErrorMessageTypes | undefined>
  ) => void;
  recipe: GPRecipeDataTypes;
};

const updateRecipeWithPricing = async ({
  setMessage,
  recipe,
}: GPUpdateRecipePricingTypes) => {
  const ownedIngredients = await fetchUserIngredientsHelper({
    setMessage: setMessage,
  });
  const estimatedRecipeCostInfo = await estimateRecipeCost({
    ownedIngredients,
    recipeIngredients: recipe.ingredients,
  });
  // update list of meal data
  const updatedRecipe = {
    ...recipe,
    ingredientCostInfo: estimatedRecipeCostInfo.ingredientCostInfo ?? 0,
    totalCost: estimatedRecipeCostInfo.estimatedCost,
  };
  return updatedRecipe;
};

export {
  validateInput,
  parseRecipeData,
  handleAuthInputChange,
  parseGroceryListDepartments,
  estimateRecipeCost,
  updateRecipeWithPricing,
};
