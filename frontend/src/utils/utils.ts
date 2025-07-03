import type { RecipeUserAccountInfo, RecipeAuthFormData, IngredientData } from "./types";

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
        totalEstimatedCost: estimateTotalCost(recipe.ingredients)
    }))
}

const parseIngredients = (ingredientsData: any) => {
    return ingredientsData.map((ingredient: any) => ({
        department: ingredient.aisle,
        image: ingredient.image,
        name: ingredient.name,
        amount: ingredient.amount,
        unit: ingredient.unit,
        estimatedCost: getIngredientCost(ingredient.name)
    }))
}

const getIngredientCost = (ingredientName: string) => {
    return 0;
}

const estimateTotalCost = (ingredients: IngredientData) => {
    return 0;
}

const validateInput = (formData: RecipeAuthFormData) => {
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

const handleNewUser = async (newUser: RecipeUserAccountInfo) => {
    try {
      const response = await fetch("http://localhost:3000/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newUser),
      });
      if (!response.ok) {
        throw new Error("Failed to create user");
      }
      const data = await response.json();
    } catch (error) {
      console.error(error);
    }
  };

  const handleAuthInputChange = (event: React.ChangeEvent<HTMLInputElement>, setFormData: React.Dispatch<React.SetStateAction<RecipeAuthFormData>>) => {
    const credential = event.target.dataset.credential as keyof RecipeAuthFormData
    const value = event.target.value;
    setFormData((prev) => ({ ...prev, [credential]: value }));
  };

export { validateInput, handleNewUser, parseRecipeData, handleAuthInputChange };
