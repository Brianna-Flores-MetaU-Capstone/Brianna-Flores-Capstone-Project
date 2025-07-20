const PreferenceCategoryEnum = {
  INTOLERANCES: "INTOLERANCES",
  DIETS: "DIETS",
};

const AuthenticationFieldEnum = {
  NAME: "name",
  EMAIL: "email",
  PASSWORD: "password",
};

const EventTimeEnum = {
  DATE: "date",
  START: "start",
  END: "end",
};

const IngredientDataFields = {
  DEPARTMENT: "department",
  IMAGE: "image",
  NAME: "ingredientName",
  QUANTITY: "quantity",
  UNIT: "unit",
  ESTIMATED_COST: "estimatedCost",
  EXPIRATION_DATE: "expirationDate",
};

const RecipeDataFields = {
  ID: "id",
  API_ID: "apiId",
  TITLE: "recipeTitle",
  IMAGE: "previewImage",
  SERVINGS: "servings",
  INGREDIENTS: "ingredients",
  INSTRUCTIONS: "instructions",
  URL: "sourceUrl",
  TIME: "readyInMinutes",
  VEGETARIAN: "vegetarian",
  VEGAN: "vegan",
  GLUTEN_FREE: "glutenFree",
  DAIRY_FREE: "dairyFree",
  COST_INFO: "ingredientCostInfo",
  TOTAL_COST: "totalCost",
};

const GROUP_OF_DISPLAYED_CARDS = 3;
const TOTAL_SEARCH_REQUESTS = 6;
const INGREDIENT_MODAL = "ingredients-page";
const GROCERY_MODAL = "grocery-page";

const START_OF_DAY_TIME = 8;
const END_OF_DAY_TIME = 20;

const PreviewConstants = {
  GROCERY: "Grocery List",
  INGREDIENT: "Ingredients on Hand",
};

export {
  PreferenceCategoryEnum,
  AuthenticationFieldEnum,
  IngredientDataFields,
  RecipeDataFields,
  PreviewConstants,
  EventTimeEnum,
  GROUP_OF_DISPLAYED_CARDS,
  TOTAL_SEARCH_REQUESTS,
  INGREDIENT_MODAL,
  GROCERY_MODAL,
  START_OF_DAY_TIME,
  END_OF_DAY_TIME,
};
