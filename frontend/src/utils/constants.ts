const PreferenceCategoryEnum = {
  INTOLERANCES: "INTOLERANCES",
  DIETS: "DIETS",
};

const AuthenticationFieldEnum = {
  EMAIL: "email",
  PASSWORD: "password",
};

const ingredientDataFields = {
  DEPARTMENT: "department",
  IMAGE: "image",
  NAME: "name",
  QUANTITY: "quantity",
  UNIT: "unit",
  ESTIMATED_COST: "estimatedCost",
  EXPIRATION_DATE: "expirationDate",
};

const GROUP_OF_DISPLAYED_CARDS = 3;
const TOTAL_SEARCH_REQUESTS = 6;
const INGREDIENT_MODAL = "ingredients-page";
const GROCERY_MODAL = "grocery-page";

const preview = {
    GROCERY: "Grocery List",
    INGREDIENT: "Ingredients on Hand"
}

const severity = {
  SUCCESS: "success",
  INFO: "info",
  WARNING: "warning",
  ERROR: "error"
}

export {
  PreferenceCategoryEnum,
  AuthenticationFieldEnum,
  ingredientDataFields,
  preview,
  severity,
  GROUP_OF_DISPLAYED_CARDS,
  TOTAL_SEARCH_REQUESTS,
  INGREDIENT_MODAL,
  GROCERY_MODAL,
};
