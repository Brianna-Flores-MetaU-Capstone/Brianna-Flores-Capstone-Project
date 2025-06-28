import type { recipeType, ingredientType, newUserType, formData } from "./types"

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

const estimateTotalCost = (ingredients: ingredientType) => {
    return 0;
}

const validateInput = (formData: formData) => {
  if (!formData.username || !formData.password) {
    return { type: "error", text: "Username and password are required" };
  }

  if (formData.password.length < 8) {
    return {
      type: "error",
      text: "Password must be at least 8 characters long",
    };
  }
  return { type: "", text: "" };
};

const handleNewUser = async (newUser: newUserType) => {
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
      console.log("successfully created a user: ", data);
    } catch (error) {
      console.error(error);
    }
  };

export { validateInput, handleNewUser, parseRecipeData };
