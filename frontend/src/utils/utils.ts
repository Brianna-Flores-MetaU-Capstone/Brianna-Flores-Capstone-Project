import type {
  GPAuthFormDataTypes,
  GPIngredientDataTypes,
  GPRecipeIngredientTypes,
  GPIngredientWithCostInfoTypes,
} from "./types";
import axios from "axios";
import { axiosConfig } from "./databaseHelpers";

const databaseUrl = import.meta.env.VITE_DATABASE_URL;

const parseRecipeData = async (recipeData: any) => {
  return await Promise.all(
    recipeData.map(async (recipe: any) => {
      const parsedIngredinets = parseIngredients(recipe.extendedIngredients);
      const parsedInstructions = parseInstructions(
        recipe.analyzedInstructions[0].steps
      );
      return {
        apiId: recipe.id,
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
        ingredientCostInfo: [],
        totalCost: 0,
        isChecked: false,
      };
    })
  );
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

const validateInput = (formData: GPAuthFormDataTypes) => {
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
  setFormData: React.Dispatch<React.SetStateAction<GPAuthFormDataTypes>>
) => {
  const credential = event.target.dataset
    .credential as keyof GPAuthFormDataTypes;
  const value = event.target.value;
  setFormData((prev) => ({ ...prev, [credential]: value }));
};

const parseGroceryListDepartments = (
  groceryList: GPIngredientWithCostInfoTypes[]
) => {
  let departments: string[] = [];
  for (const grocery of groceryList) {
    if (!departments.includes(grocery.department)) {
      departments = [...departments, grocery.department];
    }
  }
  return departments;
};

export {
  validateInput,
  parseRecipeData,
  handleAuthInputChange,
  parseGroceryListDepartments,
  estimateRecipeCost,
};
