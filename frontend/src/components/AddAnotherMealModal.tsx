import React from "react";
import { useState } from "react";
import MealCard from "./MealCard";
import {
  GROUP_OF_DISPLAYED_CARDS,
  TOTAL_SEARCH_REQUESTS,
} from "../utils/constants";
import { parseRecipeData } from "../utils/utils";
import type {
  GPRecipeDataTypes,
  GPErrorMessageTypes,
} from "../utils/types";
import ErrorState from "./ErrorState";
import TitledListView from "./TitledListView";
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
import RecipeDiffModal from "./RecipeDiffModal";
import { updateRecipeWithPricing } from "../utils/utils";
import LoadingModal from "./LoadingModal";
import { getRecipeDiffResults } from "../utils/diffUtils";
import { CenteredTitledListStyle } from "../utils/UIStyle";

const spoonacularUrl = import.meta.env.VITE_SPOONACULAR_URL;
const API_KEY = import.meta.env.VITE_APP_API_KEY;

type GPAddAnotherMealProps = {
  toggleModal: () => void;
  onSelectRecipe: (data: GPRecipeDataTypes) => void;
  modalOpen: boolean;
};

const AddAnotherMealModal: React.FC<GPAddAnotherMealProps> = ({
  toggleModal,
  onSelectRecipe,
  modalOpen,
}) => {
  const [recipeRequest, setRecipeRequest] = useState("");
  const [mealResults, setMealResults] = useState<GPRecipeDataTypes[]>([]);
  const [searchClicked, setSearchClicked] = useState(false); // search recipes button clicked
  const [numInDatabase, setNumInDatabase] = useState(0);
  const [loadingSearchButton, setLoadingSearchButton] = useState(false);
  const [loadingModal, setLoadingModal] = useState(false);
  const [message, setMessage] = useState<GPErrorMessageTypes>();
  const [usePreferences, setUsePreferences] = useState(false);
  const [inputError, setInputError] = useState(false);
  const [recipesToCompare, setRecipesToCompare] = useState<GPRecipeDataTypes[]>(
    []
  );
  const [recipeDiffModalOpen, setRecipeDiffModalOpen] = useState(false);
  const [recipeDiffData, setRecipeDiffData] = useState<GPRecipeDiffType>();

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
    const userDiets = parsePreferenceList(user?.diets ?? []);
    const userIntolerances = parsePreferenceList(user?.intolerances ?? []);
    const recipeUrl = usePreferences
      ? `${spoonacularUrl}/recipes/complexSearch?apiKey=${API_KEY}&query=${recipeRequest}&number=${numToRequest}&addRecipeInformation=true&fillIngredients=true&offset=${offset}&instructionsRequired=true&diet=${userDiets}&intolerances=${userIntolerances}`
      : `${spoonacularUrl}/recipes/complexSearch?apiKey=${API_KEY}&query=${recipeRequest}&number=${numToRequest}&addRecipeInformation=true&fillIngredients=true&offset=${offset}&instructionsRequired=true`;
    try {
      setLoadingSearchButton(true);
      const response = await axios.get(recipeUrl);
      const parsedRecipes = await parseRecipeData(response.data.results);
      if (searchClicked) {
        setMealResults((prev) => [...prev, ...parsedRecipes]);
      } else {
        setMealResults(parsedRecipes);
      }
      setLoadingSearchButton(false);
      // TODO: add fetched recipes to database helper method
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
    setRecipesToCompare([]);
    // TODO: check if recipes in database and set numInDatabase, fetch only recipes required
    handleFetchRecipes(true);
    setSearchClicked(true);
  };

  const handleGenerateMore = (event: React.MouseEvent<HTMLButtonElement>) => {
    handleFetchRecipes(false);
    setSearchClicked(false);
  };

  const handleUpdateRecipeInfo = (
    updatedRecipeInfo: GPRecipeDataTypes,
    index: number
  ) => {
    const updatedFetchedMeals = [
      ...mealResults.slice(0, index),
      updatedRecipeInfo,
      ...mealResults.slice(index + 1),
    ];
    setMealResults(updatedFetchedMeals);
  };

  const handleToggleCompareRecipe = (clickedRecipe: GPRecipeDataTypes) => {
    if (
      !recipesToCompare.some((recipe) => recipe.apiId === clickedRecipe.apiId)
    ) {
      // recipe not found, add to array
      setRecipesToCompare((prev) => [...prev, clickedRecipe]);
    } else {
      setRecipesToCompare((prev) =>
        prev.filter((recipe) => recipe.apiId !== clickedRecipe.apiId)
      );
    }
  };

  const compareRecipesClick = async () => {
    if (recipesToCompare.length === 2) {
      setLoadingModal(true);
      let updatedRecipesToCompare: GPRecipeDataTypes[] = [];
      for (const recipe of recipesToCompare) {
        const updatedRecipe = await updateRecipeWithPricing({
          setMessage,
          recipe,
        });
        updatedRecipesToCompare = [...updatedRecipesToCompare, updatedRecipe];
        // find index of recipe in meal results so we can also update the recipe information there too
        const index = mealResults.findIndex(
          (element) => element.apiId === recipe.apiId
        );
        handleUpdateRecipeInfo(updatedRecipe, index);
        setRecipesToCompare(updatedRecipesToCompare);
      }
      const recipeDiffResults = getRecipeDiffResults({
        recipeA: updatedRecipesToCompare[0],
        recipeB: updatedRecipesToCompare[1],
      });
      setRecipeDiffData(recipeDiffResults);
      setLoadingModal(false);
      setRecipeDiffModalOpen(true);
    }
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
                  sx={{
                    my: 3,
                    display: "flex",
                    justifyContent: "space-between",
                  }}
                >
                  {/* Code Referenced from MUI Documentation: https://mui.com/joy-ui/react-switch/ */}
                  <FormControl
                    orientation="horizontal"
                    sx={{ justifyContent: "space-between" }}
                  >
                    <FormLabel>Apply Dietary Preferences</FormLabel>
                    <Switch
                      checked={usePreferences}
                      onChange={(
                        event: React.ChangeEvent<HTMLInputElement>
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
            {/* Display error message if needed */}
            {message && (
              <ErrorState error={message.error} message={message.message} />
            )}
            <TitledListView
              itemsList={mealResults}
              renderItem={(meal, index) => (
                <MealCard
                  key={index}
                  index={index}
                  favorited={false}
                  onMealCardClick={() => event?.preventDefault()}
                  setMessage={setMessage}
                  parsedMealData={meal}
                  onSelectRecipe={onSelectRecipe}
                  onLoadRecipeCost={handleUpdateRecipeInfo}
                  selectedToCompare={recipesToCompare.some(
                    (recipe) => recipe.apiId === meal.apiId
                  )}
                  onCompareSelect={handleToggleCompareRecipe}
                  cardSize={350}
                />
              )}
              listItemsStyle={CenteredTitledListStyle}
            />
            {/* if search clicked, add a generate more button */}
            <ButtonGroup buttonFlex={1} spacing={{ xs: 10 }} color="primary">
              {searchClicked && !loadingSearchButton && (
                <Button onClick={handleGenerateMore}>Generate More!</Button>
              )}
              {mealResults.length > 0 && (
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
      <LoadingModal modalOpen={loadingModal} message="Generating comparison" />
      <RecipeDiffModal
        modalOpen={recipeDiffModalOpen}
        toggleModal={() => setRecipeDiffModalOpen((prev) => !prev)}
        recipeDiffData={
          recipeDiffData ?? {
            recipeA: recipesToCompare[0],
            recipeB: recipesToCompare[1],
            servingsDiff: false,
            recipeIngredientDiff: {
              added: [],
              deleted: [],
              changed: [],
              unchanged: [],
            },
            purchasedIngredientsDiff: {
              added: [],
              deleted: [],
              changed: [],
              unchanged: [],
            },
          }
        }
      />
    </>
  );
};

export default AddAnotherMealModal;
