import type {
  GPAccountInfoTypes,
  GPAuthFormDataTypes,
  GPIngredientDataTypes,
} from "./types";

const parseRecipeData = (recipeData: any) => {
  return recipeData.map((recipe: any) => ({
    id: recipe.id,
    image: recipe.image,
    title: recipe.title,
    servings: recipe.servings,
    sourceUrl: recipe.sourceUrl,
    vegetarian: recipe.vegetarian,
    vegan: recipe.vegan,
    glutenFree: recipe.glutenFree,
    dairyFree: recipe.dairyFree,
    ingredients: parseIngredients(recipe.extendedIngredients),
    totalEstimatedCost: estimateTotalCost(recipe.ingredients),
  }));
};

const parseIngredients = (ingredientsData: any) => {
  return ingredientsData.map((ingredient: any) => ({
    department: ingredient.aisle,
    image: ingredient.image,
    name: ingredient.name,
    amount: ingredient.amount,
    unit: ingredient.unit,
    estimatedCost: getIngredientCost(ingredient.name),
  }));
};

const getIngredientCost = (ingredientName: string) => {
  return 0;
};

const estimateTotalCost = (ingredients: GPIngredientDataTypes) => {
  return 0;
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

const GPModalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
};

export {
  validateInput,
  parseRecipeData,
  handleAuthInputChange,
  GPModalStyle,
};
