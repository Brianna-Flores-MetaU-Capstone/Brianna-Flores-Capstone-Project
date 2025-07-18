import React from "react";
import { useState } from "react";
import MealCard from "./MealCard";
import {
  GROUP_OF_DISPLAYED_CARDS,
  TOTAL_SEARCH_REQUESTS,
} from "../utils/constants";
import { parseRecipeData } from "../utils/utils";
import type { GPRecipeDataTypes, GPErrorMessageTypes } from "../utils/types";
import ErrorState from "./ErrorState";
import TitledListView from "./TitledListView";
import { fetchUserIngredientsHelper } from "../utils/databaseHelpers";
import { v4 as uuidv4 } from "uuid";
import axios from "axios";
import { useUser } from "../contexts/UserContext";
import {
  Box,
  Button,
  Modal,
  ModalClose,
  Switch,
  FormControl,
  FormLabel,
  ModalDialog,
  DialogContent,
  Input,
  FormHelperText,
} from "@mui/joy";
import InfoOutlined from "@mui/icons-material/InfoOutline";

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
  const [recipeRequest, setRecipeRequest] = useState("");
  const [mealResults, setMealResults] = useState<GPRecipeDataTypes[]>([]);
  const [searchClicked, setSearchClicked] = useState(false); // search recipes button clicked
  const [numInDatabase, setNumInDatabase] = useState(0);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<GPErrorMessageTypes>();
  const [usePreferences, setUsePreferences] = useState(false);
  const [inputError, setInputError] = useState(false);
  const { user } = useUser();

  const parsePreferenceList = (preferenceList: string[]) => {
    let parsedPreferences = "";
    for (const preference of preferenceList) {
      parsedPreferences += preference.toLowerCase() + ",";
    }
    return parsedPreferences;
  };

  const handleRequestChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newRecipeRequest = event.target.value;
    setRecipeRequest(newRecipeRequest);
    setInputError(event.target.value === "");
  };

  // fetch recipes from API dependent on user input
  const fetchSearchRecipes = async ({
    numToRequest,
    offset,
  }: {
    numToRequest: number;
    offset: number;
  }) => {
    const ownedIngredients = await fetchUserIngredientsHelper({
      setMessage: setErrorMessage,
    });
    const userDiets = parsePreferenceList(user?.diets ?? []);
    const userIntolerances = parsePreferenceList(user?.intolerances ?? []);
    const recipeUrl = usePreferences
      ? `https://api.spoonacular.com/recipes/complexSearch?apiKey=${API_KEY}&query=${recipeRequest}&number=${numToRequest}&addRecipeInformation=true&fillIngredients=true&offset=${offset}&instructionsRequired=true&diet=${userDiets}&intolerances=${userIntolerances}`
      : `https://api.spoonacular.com/recipes/complexSearch?apiKey=${API_KEY}&query=${recipeRequest}&number=${numToRequest}&addRecipeInformation=true&fillIngredients=true&offset=${offset}&instructionsRequired=true`;
    try {
      setLoading(true);
      const response = await axios.get(recipeUrl);
      const parsedRecipes = await parseRecipeData(
        ownedIngredients,
        response.data.results
      );
      if (searchClicked) {
        setMealResults((prev) => [...prev, ...parsedRecipes]);
      } else {
        setMealResults(parsedRecipes);
      }
      setLoading(false);
      // TODO: add fetched recipes to database helper method
    } catch (error) {
      setErrorMessage({
        error: true,
        message: `Error fetching from api`,
      });
    }
  };

  const handleFetchRecipes = (firstSearch: boolean) => {
    const recipesOnHand = firstSearch ? 0 : numInDatabase;
    const numToRequest = TOTAL_SEARCH_REQUESTS - recipesOnHand;
    // calculate offset; assume recipes in database are first n from database, offset by that number
    if (numToRequest > 0) {
      if (numToRequest % GROUP_OF_DISPLAYED_CARDS === 0) {
        fetchSearchRecipes({
          numToRequest: GROUP_OF_DISPLAYED_CARDS,
          offset: recipesOnHand,
        });
        setNumInDatabase((prev) => prev + GROUP_OF_DISPLAYED_CARDS);
      } else {
        fetchSearchRecipes({
          numToRequest:
            GROUP_OF_DISPLAYED_CARDS -
            (recipesOnHand % GROUP_OF_DISPLAYED_CARDS),
          offset: recipesOnHand,
        });
        setNumInDatabase(
          (prev) =>
            prev +
            GROUP_OF_DISPLAYED_CARDS -
            (recipesOnHand % GROUP_OF_DISPLAYED_CARDS)
        );
      }
    }
  };

  const handleSearchSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setNumInDatabase(0);
    setSearchClicked(false);
    setMealResults([]);
    // TODO: check if recipes in database and set numInDatabase, fetch only recipes required
    handleFetchRecipes(true);
    setSearchClicked(true);
  };

  const handleGenerateMore = (event: React.MouseEvent<HTMLButtonElement>) => {
    handleFetchRecipes(false);
    setSearchClicked(false);
  };

  return (
    <Modal open={modalOpen} onClose={handleModalClose}>
      <ModalDialog layout="fullscreen">
        <ModalClose />
        <DialogContent sx={{ my: 3 }}>
          <Box>
            <form onSubmit={handleSearchSubmit}>
              <FormControl error={inputError}>
                <FormLabel>Recipe</FormLabel>
                <Input
                  slotProps={{
                    input: { "data-reciperequest": "recipeName" },
                  }}
                  onChange={handleRequestChange}
                  value={recipeRequest}
                  required
                />
                {inputError && (
                  <FormHelperText>
                    <InfoOutlined />
                    Must enter a search term
                  </FormHelperText>
                )}
              </FormControl>
              <Box
                sx={{ my: 3, display: "flex", justifyContent: "space-between" }}
              >
                {/* Code Referenced from MUI Documentation: https://mui.com/joy-ui/react-switch/ */}
                <FormControl
                  orientation="horizontal"
                  sx={{ width: "10%", justifyContent: "space-between" }}
                >
                  <FormLabel>Use Dietary Preferences</FormLabel>
                  <Switch
                    checked={usePreferences}
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                      setUsePreferences(event.target.checked)
                    }
                    variant={usePreferences ? "solid" : "outlined"}
                    endDecorator={usePreferences ? "On" : "Off"}
                    slotProps={{
                      endDecorator: {
                        sx: {
                          minWidth: 24,
                        },
                      },
                    }}
                  />
                </FormControl>
                <Button type="submit" loading={loading} loadingPosition="start">
                  Find Recipes!
                </Button>
              </Box>
            </form>
          </Box>
          {/* Display error message if needed */}
          {errorMessage && (
            <ErrorState
              error={errorMessage.error}
              message={errorMessage.message}
            />
          )}
          <TitledListView
            list={mealResults}
            renderItem={(meal) => (
              <MealCard
                key={uuidv4()}
                onMealCardClick={() => event?.preventDefault()}
                parsedMealData={meal}
                onSelectRecipe={onSelectRecipe}
              />
            )}
            flexDirectionRow={true}
          />
          {/* if search clicked, add a generate more button */}
          {searchClicked && !loading && (
            <Button onClick={handleGenerateMore}>Generate More!</Button>
          )}
        </DialogContent>
      </ModalDialog>
    </Modal>
  );
};

export default AddAnotherMealModal;
