import React from "react";
import { useState } from "react";
import MealCard from "./MealCard";
import {
  GROUP_OF_DISPLAYED_CARDS,
  TOTAL_SEARCH_REQUESTS,
} from "../utils/constants";
import { parseRecipeData, GPModalStyle } from "../utils/utils";
import type {
  GPRecipeDataTypes,
  GPRequestFormDataTypes,
  GPErrorMessageTypes,
} from "../utils/types";
import "../styles/Meal.css";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import ErrorState from "./ErrorState";
import GenericList from "./GenericList";

const API_KEY = import.meta.env.VITE_APP_API_KEY;

type GPAddAnotherMealProps = {
  handleModalClose: () => void;
  onSelectRecipe: (data: GPRecipeDataTypes) => void;
  modalOpen: boolean;
};

const AddAnotherMealModal: React.FC<GPAddAnotherMealProps> = ({
  handleModalClose,
  onSelectRecipe,
  modalOpen,
}) => {
  const [mealRequest, setMealRequest] = useState<GPRequestFormDataTypes>({
    recipeName: "",
    servings: "",
  });
  const [mealResults, setMealResults] = useState<GPRecipeDataTypes[]>([]);
  const [searchClicked, setSearchClicked] = useState(false); // search recipes button clicked
  const [numInDatabase, setNumInDatabase] = useState(0);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<GPErrorMessageTypes>();

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const reciperequest = event.target.dataset
      .reciperequest as keyof GPRequestFormDataTypes;
    const value = event.target.value;
    setMealRequest((prev) => ({ ...prev, [reciperequest]: value }));
  };

  // fetch recipes from API dependent on user input
  const fetchSearchRecipes = async ({
    numToRequest,
    offset,
  }: {
    numToRequest: number;
    offset: number;
  }) => {
    try {
      setLoading(true);
      const response = await fetch(
        `https://api.spoonacular.com/recipes/complexSearch?apiKey=${API_KEY}&query=${mealRequest.recipeName}&number=${numToRequest}&addRecipeInformation=true&fillIngredients=true&offset=${offset}`
      );
      if (!response.ok) {
        const errorResponse = await response.json();
        setErrorMessage({
          error: true,
          message: `Error: ${errorResponse.message}`,
        });
      }
      const data = await response.json();
      const parsedRecipes = parseRecipeData(data.results);
      if (searchClicked) {
        setMealResults((prev) => [...prev, ...parsedRecipes]);
      } else {
        setMealResults(parsedRecipes);
      }
      setLoading(false);
      // TODO: add fetched recipes to database helper method
    } catch (error) {
      // TODO use error state
      console.error(error);
    }
  };

  const fetchRandomRecipes = async () => {
    // TODO take into account user ingredients
    try {
      setLoading(true);
      const response = await fetch(
        `https://api.spoonacular.com/recipes/findByIngredients?apiKey=${API_KEY}&ingredients=bread,cheese,pasta,spinach,tomato&number=3&ranking=2`
      );
      if (!response.ok) {
        const errorResponse = await response.json();
        setErrorMessage({
          error: true,
          message: `Error: ${errorResponse.message}`,
        });
      }
      const data = await response.json();
      // array of recipes
      setMealResults(data);
      setLoading(false);
      // TODO: check if recipes are in database (according to id), otherwise add to database
      // helper method (due to repeated code)
    } catch (error) {
      // TODO use error state
      console.error(error);
    }
  };

  const handleFetchRecipes = () => {
    const numToRequest = TOTAL_SEARCH_REQUESTS - numInDatabase;
    // calculate offset; assume recipes in database are first n from database, offset by that number
    if (numToRequest > 0) {
      if (numToRequest % GROUP_OF_DISPLAYED_CARDS === 0) {
        fetchSearchRecipes({
          numToRequest: GROUP_OF_DISPLAYED_CARDS,
          offset: numInDatabase,
        });
        setNumInDatabase((prev) => prev + GROUP_OF_DISPLAYED_CARDS);
      } else {
        fetchSearchRecipes({
          numToRequest:
            GROUP_OF_DISPLAYED_CARDS -
            (numInDatabase % GROUP_OF_DISPLAYED_CARDS),
          offset: numInDatabase,
        });
        setNumInDatabase(
          (prev) =>
            prev +
            GROUP_OF_DISPLAYED_CARDS -
            (numInDatabase % GROUP_OF_DISPLAYED_CARDS)
        );
      }
    }
  };

  const handleSearchSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    // TODO: check if recipes in database and set numInDatabase, fetch only recipes required
    handleFetchRecipes();
    setSearchClicked(true);
  };

  const handleGenerateMore = (event: React.MouseEvent<HTMLButtonElement>) => {
    handleFetchRecipes();
    setSearchClicked(false);
  };

  return (
    <Modal open={modalOpen} onClose={handleModalClose}>
      <Box sx={GPModalStyle}>
        <Button loading={loading} onClick={fetchRandomRecipes}>
          Need Some Inspiration?
        </Button>
        <Button>I Have My Own Recipe</Button>
        <form className="meal-form" onSubmit={handleSearchSubmit}>
          <TextField
            required
            slotProps={{ htmlInput: { "data-reciperequest": "recipeName" } }}
            onChange={handleInputChange}
            value={mealRequest.recipeName}
            label="Recipe"
            variant="standard"
          />
          <TextField
            required
            slotProps={{ htmlInput: { "data-reciperequest": "servings" } }}
            onChange={handleInputChange}
            value={mealRequest.servings}
            label="Servings"
            variant="standard"
          />
          <Button
            type="submit"
            loading={loading}
            variant="outlined"
            loadingPosition="start"
          >
            Find some Recipes!
          </Button>
        </form>

        {/* Display error message if needed */}
        {errorMessage && (
          <ErrorState
            error={errorMessage.error}
            message={errorMessage.message}
          />
        )}
        <GenericList
          className="result-cards"
          list={mealResults}
          renderItem={(meal) => (
            <MealCard
              key={meal.id}
              onMealCardClick={() => event?.preventDefault()}
              parsedMealData={meal}
              onSelectRecipe={onSelectRecipe}
            />
          )}
        />
        {/* if search clicked, add a generate more button */}
        {searchClicked && (
          <Button onClick={handleGenerateMore}>Generate More!</Button>
        )}
      </Box>
    </Modal>
  );
};

export default AddAnotherMealModal;
