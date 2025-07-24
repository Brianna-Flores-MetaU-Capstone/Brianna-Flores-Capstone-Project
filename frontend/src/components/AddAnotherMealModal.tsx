import React from "react";
import { useState } from "react";
import MealCard from "./recipeDisplay/MealCard";
import {
  GROUP_OF_DISPLAYED_CARDS,
  TOTAL_SEARCH_REQUESTS,
} from "../utils/constants";
import { parseRecipeData } from "../utils/utils";
import type { GPErrorMessageTypes } from "../utils/types/types";
import ErrorState from "./utils/ErrorState";
import TitledListView from "./utils/TitledListView";
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
  ButtonGroup,
} from "@mui/joy";
import InfoOutlined from "@mui/icons-material/InfoOutline";
import type { GPRecipeDiffType } from "../utils/diffUtils";
import RecipeDiffModal from "./recipeDiff/RecipeDiffModal";
import { updateRecipeWithPricing } from "../utils/utils";
import LoadingModal from "./utils/LoadingModal";
import { getRecipeDiffResults } from "../utils/diffUtils";
import { CenteredTitledListStyle } from "../utils/style/UIStyle";
import { Recipe } from "../../../shared/Recipe";
import MealInfoModal from "./recipeDisplay/MealInfoModal";
import { useNavigate } from "react-router";

const spoonacularUrl = import.meta.env.VITE_SPOONACULAR_URL;
const API_KEY = import.meta.env.VITE_APP_API_KEY;

type GPAddAnotherMealProps = {
  toggleModal: () => void;
  onSelectRecipe: (data: Recipe) => void;
  modalOpen: boolean;
};

const AddAnotherMealModal: React.FC<GPAddAnotherMealProps> = ({
  toggleModal,
  onSelectRecipe,
  modalOpen,
}) => {
  const [recipeSearchTerm, setRecipeSearchTerm] = useState("");
  const [apiMealResults, setApiMealResults] = useState<Recipe[]>([]);
  const [searchRecipesClicked, setSearchRecipesClicked] = useState(false);
  const [numInDatabase, setNumInDatabase] = useState(0);
  const [loadingSearchButton, setLoadingSearchButton] = useState(false);
  const [loadingModalOpen, setLoadingModalOpen] = useState(false);
  const [message, setMessage] = useState<GPErrorMessageTypes>();
  const [usePreferences, setUsePreferences] = useState(false);
  const [inputError, setInputError] = useState(false);
  const [recipesToCompare, setRecipesToCompare] = useState<Recipe[]>([]);
  const [recipeDiffModalOpen, setRecipeDiffModalOpen] = useState(false);
  const [recipeDiffData, setRecipeDiffData] = useState<GPRecipeDiffType>();
  const [recipeInfoModalOpen, setRecipeInfoModalOpen] = useState(false);
  const [recipeInfoModalInfo, setRecipeInfoModalInfo] = useState<Recipe>();

  const { user } = useUser();
  const navigate = useNavigate()

  const parsePreferenceList = (preferenceList: string[]) => {
    let parsedPreferences = "";
    for (const preference of preferenceList) {
      parsedPreferences += preference.toLowerCase() + ",";
    }
    return parsedPreferences;
  };

  const handleRequestChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newRecipeRequest = event.target.value;
    setRecipeSearchTerm(newRecipeRequest);
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
    const userDiets = parsePreferenceList(user?.diets ?? []);
    const userIntolerances = parsePreferenceList(user?.intolerances ?? []);
    const recipeUrl = usePreferences
      ? `${spoonacularUrl}/recipes/complexSearch?apiKey=${API_KEY}&query=${recipeSearchTerm}&number=${numToRequest}&addRecipeInformation=true&fillIngredients=true&offset=${offset}&instructionsRequired=true&diet=${userDiets}&intolerances=${userIntolerances}`
      : `${spoonacularUrl}/recipes/complexSearch?apiKey=${API_KEY}&query=${recipeSearchTerm}&number=${numToRequest}&addRecipeInformation=true&fillIngredients=true&offset=${offset}&instructionsRequired=true`;
    try {
      setLoadingSearchButton(true);
      const response = await axios.get(recipeUrl);
      const parsedRecipes = await parseRecipeData(response.data.results);
      if (searchRecipesClicked) {
        setApiMealResults((prev) => [...prev, ...parsedRecipes]);
      } else {
        setApiMealResults(parsedRecipes);
      }
      setLoadingSearchButton(false);
    } catch (error) {
      setMessage({
        error: true,
        message: "Error fetching from api",
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
            (recipesOnHand % GROUP_OF_DISPLAYED_CARDS),
        );
      }
    }
  };

  const handleSearchSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setNumInDatabase(0);
    setSearchRecipesClicked(false);
    setApiMealResults([]);
    setRecipesToCompare([]);
    handleFetchRecipes(true);
    setSearchRecipesClicked(true);
  };

  const handleGenerateMore = (event: React.MouseEvent<HTMLButtonElement>) => {
    handleFetchRecipes(false);
    setSearchRecipesClicked(false);
  };

  const handleUpdateRecipeInfo = (updatedRecipeInfo: Recipe, index: number) => {
    const updatedFetchedMeals = [
      ...apiMealResults.slice(0, index),
      updatedRecipeInfo,
      ...apiMealResults.slice(index + 1),
    ];
    setApiMealResults(updatedFetchedMeals);
  };

  const handleToggleCompareRecipe = (clickedRecipe: Recipe) => {
    if (
      !recipesToCompare.some((recipe) => recipe.apiId === clickedRecipe.apiId)
    ) {
      // recipe not found, add to array
      setRecipesToCompare((prev) => [...prev, clickedRecipe]);
    } else {
      setRecipesToCompare((prev) =>
        prev.filter((recipe) => recipe.apiId !== clickedRecipe.apiId),
      );
    }
  };

  const compareRecipesClick = async () => {
    if (recipesToCompare.length === 2) {
      setLoadingModalOpen(true);
      let updatedRecipesToCompare: Recipe[] = [];
      for (const recipe of recipesToCompare) {
        const updatedRecipe = await updateRecipeWithPricing({
          setMessage,
          recipe,
        });
        updatedRecipesToCompare = [...updatedRecipesToCompare, updatedRecipe];
        // find index of recipe in meal results so we can also update the recipe information there too
        const index = apiMealResults.findIndex(
          (element) => element.apiId === recipe.apiId,
        );
        handleUpdateRecipeInfo(updatedRecipe, index);
        setRecipesToCompare(updatedRecipesToCompare);
      }
      const compareRecipeResults = getRecipeDiffResults({
        recipeA: updatedRecipesToCompare[0],
        recipeB: updatedRecipesToCompare[1],
      });
      setRecipeDiffData(compareRecipeResults);
      setLoadingModalOpen(false);
      setRecipeDiffModalOpen(true);
    }
  };

  const handleRecipeCardClick = (recipe: Recipe) => {
    setRecipeInfoModalOpen((prev) => !prev);
    setRecipeInfoModalInfo(recipe);
  };

  return (
    <>
      <Modal open={modalOpen} onClose={toggleModal}>
        <ModalDialog layout="fullscreen">
          <ModalClose />
          <DialogContent sx={{ my: 3 }}>
            <Box>
              <form onSubmit={handleSearchSubmit}>
                <FormControl error={inputError}>
                  <FormLabel>Search</FormLabel>
                  <Input
                    slotProps={{
                      input: { "data-reciperequest": "recipeName" },
                    }}
                    onChange={handleRequestChange}
                    value={recipeSearchTerm}
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
                  sx={{
                    my: 3,
                    display: "flex",
                    justifyContent: "space-between",
                  }}
                >
                  <Box sx={{display: "flex", alignItems: "center", gap: 1}}>
                  {/* Code Referenced from MUI Documentation: https://mui.com/joy-ui/react-switch/ */}
                  <FormControl
                    orientation="horizontal"
                    sx={{ justifyContent: "space-between" }}
                  >
                    <FormLabel>Apply Dietary Preferences</FormLabel>
                    <Switch
                      checked={usePreferences}
                      onChange={(
                        event: React.ChangeEvent<HTMLInputElement>,
                      ) => {
                        setUsePreferences(event.target.checked);
                      }}
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
                  <Button onClick={() => navigate("/account")}>Edit Dietary Preferences</Button>
                  </Box>
                  <Button
                    type="submit"
                    loading={loadingSearchButton}
                    loadingPosition="start"
                  >
                    Find Recipes!
                  </Button>
                </Box>
              </form>
            </Box>
            {message && (
              <ErrorState error={message.error} message={message.message} />
            )}
            <TitledListView
              itemsList={apiMealResults}
              renderItem={(meal, index) => (
                <MealCard
                  key={index}
                  index={index}
                  favorited={false}
                  onMealCardClick={() => handleRecipeCardClick(meal)}
                  setMessage={setMessage}
                  parsedMealData={meal}
                  onSelectRecipe={onSelectRecipe}
                  onLoadRecipeCost={handleUpdateRecipeInfo}
                  selectedToCompare={recipesToCompare.some(
                    (recipe) => recipe.apiId === meal.apiId,
                  )}
                  onCompareSelect={handleToggleCompareRecipe}
                />
              )}
              listItemsStyle={CenteredTitledListStyle}
            />
            {/* if search clicked, add a generate more button */}
            <ButtonGroup buttonFlex={1} spacing={{ xs: 10 }} color="primary">
              {searchRecipesClicked && !loadingSearchButton && (
                <Button onClick={handleGenerateMore}>Generate More!</Button>
              )}
              {apiMealResults.length > 0 && (
                <Button
                  disabled={recipesToCompare.length !== 2}
                  onClick={compareRecipesClick}
                >
                  Compare Recipes!
                </Button>
              )}
            </ButtonGroup>
          </DialogContent>
        </ModalDialog>
      </Modal>
      <LoadingModal
        modalOpen={loadingModalOpen}
        message="Generating comparison"
      />
      <RecipeDiffModal
        modalOpen={recipeDiffModalOpen}
        toggleModal={() => setRecipeDiffModalOpen((prev) => !prev)}
        recipeDiffData={recipeDiffData}
      />
      <MealInfoModal
        toggleModal={() => setRecipeInfoModalOpen((prev) => !prev)}
        modalOpen={recipeInfoModalOpen}
        recipeInfo={recipeInfoModalInfo}
      />
    </>
  );
};

export default AddAnotherMealModal;
