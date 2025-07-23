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
  START: "start",
  END: "end"
}

const IngredientDataFields = {
  DEPARTMENT: "department",
  IMAGE: "image",
  NAME: "ingredientName",
  QUANTITY: "quantity",
  UNIT: "unit",
  ESTIMATED_COST: "estimatedCost",
  EXPIRATION_DATE: "expirationDate",
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
  PreviewConstants,
  EventTimeEnum,
  GROUP_OF_DISPLAYED_CARDS,
  TOTAL_SEARCH_REQUESTS,
  INGREDIENT_MODAL,
  GROCERY_MODAL,
  START_OF_DAY_TIME,
  END_OF_DAY_TIME,
};
