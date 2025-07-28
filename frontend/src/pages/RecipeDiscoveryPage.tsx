import AppHeader from "../components/utils/AppHeader";
import { Box, Button } from "@mui/joy";
import { useState, useEffect } from "react";
import type {
  GPErrorMessageTypes,
  GPRecipeDiscoveryCategories,
} from "../utils/types/types";
import {
  fetchAllRecipeCategories,
  fetchRecipes,
  handleFavoriteRecipe,
  handleUnfavoriteRecipe,
  updateUserRecipes,
} from "../utils/databaseHelpers";
import TitledListView from "../components/utils/TitledListView";
import MealCard from "../components/recipeDisplay/MealCard";
import {
  MUI_GRID_FULL_SPACE,
  RowOverflowTitledListStyle,
} from "../utils/style/UIStyle";
import ErrorState from "../components/utils/ErrorState";
import MealInfoModal from "../components/recipeDisplay/MealInfoModal";
import { useUser } from "../contexts/UserContext";
import EditRecipeModal from "../components/recipeDiff/EditRecipeModal";
import { RecipeFilter } from "../classes/filters/RecipeFilters";
import { Recipe } from "../../../shared/Recipe";
import { RecipeFetchEnum } from "../utils/constants";
import DiffOriginalRecipe from "../components/recipeDiff/DiffOriginalRecipe";
import UserDiffOptions from "../components/recipeDiff/UserDiffOptions";

const recipeFilters = [
  { filter: "all", title: "Discover All Recipes" },
  { filter: "dairyFree", title: "Dairy Free Recipes" },
  { filter: "glutenFree", title: "Gluten Free Recipes" },
  { filter: "vegetarian", title: "Vegetarian Recipes" },
  { filter: "vegan", title: "Vegan Recipes" },
];

const RecipeDiscoveryPage = () => {
  // fetch recipes from the database
  const [recipeDiscoveryResults, setRecipeDiscoveryResults] = useState(
    new RecipeFilter(),
  );
  const [message, setMessage] = useState<GPErrorMessageTypes>();
  const [recipeInfoModalOpen, setRecipeInfoModalOpen] = useState(false);
  const [recipeInfoModalInfo, setRecipeInfoModalInfo] = useState<Recipe>();
  const { user } = useUser();
  const [favoritedRecipesId, setFavoritedRecipesId] = useState<Set<number>>(
    new Set(),
  );
  const [editRecipeInfo, setEditRecipeInfo] = useState<Recipe>();
  const [editRecipeModalOpen, setEditRecipeModalOpen] = useState(false);
  const [recipesToCompare, setRecipesToCompare] = useState<Recipe[]>([]);
  const [diffModalOpen, setDiffModalOpen] = useState(false);
  const [userDiffOptionsOpen, setUserDiffOptionsOpen] = useState(false);
  const [userDiffChoices, setUserDiffChoices] = useState<Set<string>>(
    new Set(),
  );
  const [noDiffFields, setNoDiffFields] = useState<Set<string>>(new Set());

  useEffect(() => {
    setAllRecipeLists();
  }, []);

  const setAllRecipeLists = async () => {
    fetchAllRecipeCategories({
      setMessage,
      setRecipeDiscoveryResults,
      offset: 0,
    });
    const favoritedRecipesReturn = await fetchRecipes({
      setMessage,
      recipeGroup: RecipeFetchEnum.FAVORITED_IDS,
    });
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
      fetchAllRecipeCategories({
        setMessage,
        setRecipeDiscoveryResults,
        offset: 0,
      });
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
        prev.filter((recipe) => recipe.apiId !== clickedRecipe.apiId),
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
    noDiffFields: Set<string>,
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

  return (
    <>
      <Box>
        <AppHeader />
        <Button
          sx={{ display: "flex", justifySelf: "flex-end", mx: 2, mt: 3 }}
          disabled={recipesToCompare.length !== 2}
          onClick={onCompareRecipesSubmit}
        >
          Compare Recipes!
        </Button>
        <Box sx={{ m: 2 }}>
          {Object.keys(recipeDiscoveryResults).map((filter, index) => (
            <TitledListView
              key={index}
              itemsList={
                recipeDiscoveryResults[
                  filter as keyof GPRecipeDiscoveryCategories
                ]
              }
              headerList={[
                {
                  title: recipeFilters[index].title,
                  spacing: MUI_GRID_FULL_SPACE,
                },
              ]}
              renderItem={(meal, index) => (
                <MealCard
                  key={index}
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
                    (recipe) => recipe.apiId === meal.apiId,
                  )}
                  onCompareSelect={handleToggleCompareRecipe}
                />
              )}
              listItemsStyle={RowOverflowTitledListStyle}
            />
          ))}
        </Box>
        {user && message && (
          <ErrorState error={message.error} message={message.message} />
        )}
        <MealInfoModal
          toggleModal={() => setRecipeInfoModalOpen((prev) => !prev)}
          modalOpen={recipeInfoModalOpen}
          recipeInfo={recipeInfoModalInfo}
        />
        <EditRecipeModal
          recipe={editRecipeInfo}
          modalOpen={editRecipeModalOpen}
          toggleModal={() => setEditRecipeModalOpen((prev) => !prev)}
          onSubmit={setAllRecipeLists}
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
