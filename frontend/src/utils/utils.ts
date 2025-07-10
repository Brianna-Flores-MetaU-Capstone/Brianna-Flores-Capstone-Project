import type {
  GPAuthFormDataTypes,
  GPIngredientDataTypes,
  GPRecipeIngredientTypes,
} from "./types";
const databaseUrl = import.meta.env.VITE_DATABASE_URL;

const parseRecipeData = async (
  ingredientsOnHand: GPIngredientDataTypes,
  recipeData: any
) => {
  return await Promise.all(
    recipeData.map(async (recipe: any) => {
      const parsedIngredinets = parseIngredients(recipe.extendedIngredients);
      const parsedInstructions = parseInstructions(
        recipe.analyzedInstructions[0].steps
      );
      const estimatedRecipeCost = await estimateRecipeCost({
        ingredientsOnHand,
        recipeIngredients: parsedIngredinets,
      });
      return {
        apiId: recipe.id,
        recipeTitle: recipe.title,
        previewImage: recipe.image,
        servings: recipe.servings,
        ingredients: parsedIngredinets,
        instructions: parsedInstructions,
        sourceUrl: recipe.sourceUrl,
        vegetarian: recipe.vegetarian,
        vegan: recipe.vegan,
        glutenFree: recipe.glutenFree,
        dairyFree: recipe.dairyFree,
        totalCost: estimatedRecipeCost.toFixed(2),
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
  recipeIngredients: GPRecipeIngredientTypes;
  ingredientsOnHand: GPIngredientDataTypes;
};

const estimateRecipeCost = async ({
  ingredientsOnHand,
  recipeIngredients,
}: GPEstimateRecipeCostTypes) => {
  const response = await fetch(`${databaseUrl}/generateList/estimatePrice`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ ingredientsOnHand, recipeIngredients }),
    credentials: "include",
  });
  if (!response.ok) {
    console.error("Error estimating cost");
    return;
  }
  const data = await response.json();
  return data.estimatedCost;
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
  groceryList: GPRecipeIngredientTypes[]
) => {
  let departments: string[] = [];
  for (const grocery of groceryList) {
    if (!departments.includes(grocery.department)) {
      departments = [...departments, grocery.department];
    }
  }
  return departments;
};

const GPModalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "50%",
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
  maxHeight: "70%",
  overflow: "auto",
};

export {
  validateInput,
  parseRecipeData,
  handleAuthInputChange,
  parseGroceryListDepartments,
  GPModalStyle,
};
