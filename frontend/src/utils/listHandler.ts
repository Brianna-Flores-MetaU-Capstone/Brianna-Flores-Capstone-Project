import type { GPIngredientDataTypes, GPRecipeDataTypes } from "./types";

type GPCreateGroceryListType = {
  selectedRecipes: GPRecipeDataTypes[];
  ingredientsOnHand: GPIngredientDataTypes[];
};

const createGroceryList = ({
  selectedRecipes,
  ingredientsOnHand,
}: GPCreateGroceryListType) => {
  const selected = selectedRecipes;
  const onHand = ingredientsOnHand;
};

export { createGroceryList };
