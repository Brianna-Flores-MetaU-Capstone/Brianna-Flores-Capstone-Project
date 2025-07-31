import AppHeader from "../components/utils/AppHeader";
import { Box, Button, Option, Select } from "@mui/joy";
import { useState, useEffect } from "react";
import type { GPErrorMessageTypes } from "../utils/types/types";
import {
  fetchDiscoverRecipes,
  fetchPopularRecipes,
  fetchRecipes,
  handleFavoriteRecipe,
  handleUnfavoriteRecipe,
  updateUserRecipes,
} from "../utils/databaseHelpers";
import MealCard from "../components/recipeDisplay/MealCard";
import ErrorState from "../components/utils/ErrorState";
import MealInfoModal from "../components/recipeDisplay/MealInfoModal";
import { useUser } from "../contexts/UserContext";
import EditRecipeModal from "../components/editRecipe/EditRecipeModal";
import {
  recipeFiltersConst,
  recipeFiltersList,
  type recipeFilterType,
} from "../classes/filters/RecipeFilters";
import { Recipe } from "../../../shared/Recipe";
import { RecipeFetchEnum } from "../utils/constants";
import DiffOriginalRecipe from "../components/recipeDiff/DiffOriginalRecipe";
import UserDiffOptions from "../components/recipeDiff/UserDiffOptions";
import Masonry from "react-responsive-masonry";

const MAX_RECIPES_TO_DISPLAY = 50;

const RecipeDiscoveryPage = () => {
  // fetch recipes from the database
  const [message, setMessage] = useState<GPErrorMessageTypes>();
  const [recipeInfoModalOpen, setRecipeInfoModalOpen] = useState(false);
  const [recipeInfoModalInfo, setRecipeInfoModalInfo] = useState<Recipe>();
  const { user } = useUser();
  const [favoritedRecipesId, setFavoritedRecipesId] = useState<Set<number>>(
    new Set()
  );
  const [editRecipeInfo, setEditRecipeInfo] = useState<Recipe>();
  const [editRecipeModalOpen, setEditRecipeModalOpen] = useState(false);
  const [recipesToCompare, setRecipesToCompare] = useState<Recipe[]>([]);
  const [diffModalOpen, setDiffModalOpen] = useState(false);
  const [userDiffOptionsOpen, setUserDiffOptionsOpen] = useState(false);
  const [userDiffChoices, setUserDiffChoices] = useState<Set<string>>(
    new Set()
  );
  const [noDiffFields, setNoDiffFields] = useState<Set<string>>(new Set());
  const [recipeFilter, setRecipeFilter] = useState<recipeFilterType>(
    recipeFiltersList.ALL
  );
  const [displayedRecipes, setDisplayedRecipes] = useState<Recipe[]>([]);

  useEffect(() => {
    fetchRecipesToDisplay();
  }, []);

  const fetchRecipesToDisplay = async () => {
    if (recipeFilter === recipeFiltersList.FAVORITED) {
      await fetchRecipes({
        setMessage,
        setRecipes: setDisplayedRecipes,
        recipeGroup: RecipeFetchEnum.FAVORITED,
      });
    }
    if (recipeFilter === recipeFiltersList.POPULAR) {
      const popularRecipes =
        (await fetchPopularRecipes({
          setMessage,
          offset: 0,
          numRequested: MAX_RECIPES_TO_DISPLAY,
        })) ?? [];
      setDisplayedRecipes(popularRecipes);
    } else {
      const fetchedRecipes =
        (await fetchDiscoverRecipes({
          setMessage,
          filter: recipeFilter,
          offset: 0,
          numRequested: MAX_RECIPES_TO_DISPLAY,
        })) ?? [];
      setDisplayedRecipes(fetchedRecipes);
    }
    const favoritedRecipesReturn =
      (await fetchRecipes({
        setMessage,
        recipeGroup: RecipeFetchEnum.FAVORITED_IDS,
      })) ?? [];
    // set favorited recipes id
    for (const elem of favoritedRecipesReturn) {
      setFavoritedRecipesId((prev) => new Set(prev.add(elem.id)));
    }
  };

  const handleRecipeCardClick = (recipe: Recipe) => {
    setRecipeInfoModalOpen((prev) => !prev);
    setRecipeInfoModalInfo(recipe);
  };

  const handleSelectRecipeToShop = async (recipe: Recipe) => {
    if (!user) {
      setMessage({ error: true, message: "Error user not signed in" });
      return;
    }
    try {
      const userId = user.id;
      await updateUserRecipes({
        userId,
        editedRecipe: false,
        selectedRecipe: recipe,
        setMessage,
      });
    } catch (error) {
      setMessage({ error: true, message: "Error adding recipe" });
    }
  };

  const handleFavoriteClick = async (recipe: Recipe) => {
    if (user) {
      if (favoritedRecipesId.has(recipe.id)) {
        handleUnfavoriteRecipe({ setMessage, recipe });
        // Removing an element from set useState variable
        setFavoritedRecipesId((prev) => {
          prev.delete(recipe.id);
          return new Set(prev);
        });
      } else {
        handleFavoriteRecipe({
          setMessage,
          userId: user.id,
          selectedRecipe: recipe,
        });
        setFavoritedRecipesId((prev) => new Set(prev.add(recipe.id)));
      }
      await fetchRecipesToDisplay();
    }
  };

  const handleEditRecipe = (recipe: Recipe) => {
    setEditRecipeModalOpen((prev) => !prev);
    setEditRecipeInfo(recipe);
  };

  const handleToggleCompareRecipe = (clickedRecipe: Recipe) => {
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

  const onCompareRecipesSubmit = () => {
    if (recipesToCompare.length === 2) {
      setUserDiffOptionsOpen(true);
    }
  };

  const onSubmitUserDiffOptions = async (
    userChoices: Set<string>,
    noDiffFields: Set<string>
  ) => {
    setUserDiffOptionsOpen(false);
    if (!recipesToCompare[0] || !recipesToCompare[1]) {
      setMessage({
        error: true,
        message: "Error could not get recipes to compare",
      });
      return;
    }
    setUserDiffChoices(userChoices);
    setNoDiffFields(noDiffFields);
    setDiffModalOpen(true);
  };

  useEffect(() => {
    fetchRecipesToDisplay();
  }, [recipeFilter]);

  return (
    <>
      <Box>
        <AppHeader />
        <Box
          sx={{
            mt: 2,
            mx: 2,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Select
            defaultValue={"all"}
            onChange={(_, newValue) =>
              setRecipeFilter(newValue as recipeFilterType)
            }
          >
            {recipeFiltersConst.map((filter, index) => (
              <Option key={index} value={filter.filter}>
                {filter.title}
              </Option>
            ))}
          </Select>
          <Button
            disabled={recipesToCompare.length !== 2}
            onClick={onCompareRecipesSubmit}
          >
            Compare Recipes!
          </Button>
        </Box>
        <Box sx={{ m: 2 }}>
          <Masonry columnsCount={4} gutter="2vw">
            {displayedRecipes.map((meal, index) => (
              <MealCard
                key={meal.id}
                index={index}
                parsedMealData={meal}
                onMealCardClick={() => handleRecipeCardClick(meal)}
                {...(user && {
                  onSelectRecipe: () => handleSelectRecipeToShop(meal),
                })}
                {...(user && {
                  onEditRecipe: () => handleEditRecipe(meal),
                })}
                setMessage={setMessage}
                {...(user && { onFavoriteClick: handleFavoriteClick })}
                favorited={favoritedRecipesId.has(meal.id)}
                selectedToCompare={recipesToCompare.some(
                  (recipe) => recipe.apiId === meal.apiId
                )}
                onCompareSelect={handleToggleCompareRecipe}
              />
            ))}
          </Masonry>
        </Box>
        {user && message && (
          <ErrorState error={message.error} message={message.message} />
        )}
        <MealInfoModal
          toggleModal={() => setRecipeInfoModalOpen((prev) => !prev)}
          modalOpen={recipeInfoModalOpen}
          recipeInfo={recipeInfoModalInfo}
          refreshRecipes={() => fetchRecipesToDisplay()}
        />
        <EditRecipeModal
          recipe={editRecipeInfo}
          modalOpen={editRecipeModalOpen}
          getDietarySubstitutes={false}
          toggleModal={() => setEditRecipeModalOpen((prev) => !prev)}
          onSubmit={fetchRecipesToDisplay}
        />
      </Box>
      {recipesToCompare[0] && recipesToCompare[1] && (
        <DiffOriginalRecipe
          originalRecipeInfo={recipesToCompare[0]}
          editedRecipeInfo={recipesToCompare[1]}
          modalOpen={diffModalOpen}
          setModalOpen={() => setDiffModalOpen((prev) => !prev)}
          userDiffChoices={[...userDiffChoices]}
          noDiffFields={[...noDiffFields]}
        />
      )}
      <UserDiffOptions
        modalOpen={userDiffOptionsOpen}
        toggleModal={() => setUserDiffOptionsOpen((prev) => !prev)}
        onSubmit={onSubmitUserDiffOptions}
      />
    </>
  );
};

export default RecipeDiscoveryPage;
