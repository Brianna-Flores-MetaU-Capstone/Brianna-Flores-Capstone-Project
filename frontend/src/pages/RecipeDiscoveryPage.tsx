import AppHeader from "../components/AppHeader";
import { Box } from "@mui/joy";
import { useState, useEffect } from "react";
import type {
  GPErrorMessageTypes,
  GPRecipeDiscoveryCategories,
  GPRecipeDataTypes,
} from "../utils/types";
import {
  fetchAllRecipeCategories,
  fetchRecipes,
  handleFavoriteRecipe,
  handleUnfavoriteRecipe,
  updateUserRecipes,
} from "../utils/databaseHelpers";
import TitledListView from "../components/TitledListView";
import MealCard from "../components/MealCard";
import {
  MUI_GRID_FULL_SPACE,
  RowOverflowTitledListStyle,
} from "../utils/UIStyle";
import ErrorState from "../components/ErrorState";
import MealInfoModal from "../components/MealInfoModal";
import { useUser } from "../contexts/UserContext";

// https://www.typescriptlang.org/docs/handbook/utility-types.html#recordkeys-type
const recipeFilters = [
  { filter: "all", title: "Discover All Recipes" },
  { filter: "dairyFree", title: "Dairy Free Recipes" },
  { filter: "glutenFree", title: "Gluten Free Recipes" },
  { filter: "vegetarian", title: "Vegetarian Recipes" },
  { filter: "vegan", title: "Vegan Recipes" },
];

const RecipeDiscoveryPage = () => {
  // fetch recipes from the database
  const [recipeDiscoveryResults, setRecipeDiscoveryResults] =
    useState<GPRecipeDiscoveryCategories>({
      all: [],
      dairyFree: [],
      glutenFree: [],
      vegetarian: [],
      vegan: [],
    });
  const [message, setMessage] = useState<GPErrorMessageTypes>();
  const [recipeInfoModalOpen, setRecipeInfoModalOpen] = useState(false);
  const [recipeInfoModalInfo, setRecipeInfoModalInfo] =
    useState<GPRecipeDataTypes>();
  const [favoritedRecipes, setFavoritedRecipes] = useState<GPRecipeDataTypes[]>(
    []
  );
  const { user } = useUser();
  const [favoritedRecipesId, setFavoritedRecipesId] = useState<Set<number>>(
    new Set()
  );

  useEffect(() => {
    fetchAllRecipeCategories({
      setMessage,
      setRecipeDiscoveryResults,
      filters: recipeFilters,
      offset: 0,
    });
    if (user) {
      fetchRecipes({
        setMessage,
        setRecipes: setFavoritedRecipes,
        recipeGroup: "favorited",
      });
      // set favorited recipes id
      for (const elem of favoritedRecipes) {
        favoritedRecipesId.add(elem.apiId);
      }
    }
  }, []);

  const handleRecipeCardClick = (recipe: GPRecipeDataTypes) => {
    setRecipeInfoModalOpen((prev) => !prev);
    setRecipeInfoModalInfo(recipe);
  };

  const handleSelectRecipeToShop = async (recipe: GPRecipeDataTypes) => {
    if (!user) {
      setMessage({ error: true, message: "Error user not signed in" });
      return;
    }
    try {
      const userId = user.id;
      await updateUserRecipes({ userId, selectedRecipe: recipe, setMessage });
    } catch (error) {
      setMessage({ error: true, message: "Error adding recipe" });
    }
  };

  const handleFavoriteClick = async (recipe: GPRecipeDataTypes) => {
    if (user) {
      if (favoritedRecipesId.has(recipe.apiId)) {
        handleUnfavoriteRecipe({ setMessage, recipe });
        favoritedRecipesId.delete(recipe.apiId);
      } else {
        handleFavoriteRecipe({
          setMessage,
          userId: user.id,
          selectedRecipe: recipe,
        });
        favoritedRecipesId.add(recipe.apiId);
      }
      fetchRecipes({
        setMessage,
        setRecipes: setFavoritedRecipes,
        recipeGroup: "favorited",
      });
      fetchAllRecipeCategories({
        setMessage,
        setRecipeDiscoveryResults,
        filters: recipeFilters,
        offset: 0,
      });
    }
  };

  return (
    <Box>
      <AppHeader />
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
                onMealCardClick={() => handleRecipeCardClick(meal)}
                {...(user && {
                  onSelectRecipe: () => handleSelectRecipeToShop(meal),
                })}
                setMessage={setMessage}
                parsedMealData={meal}
                selectedToCompare={false}
                {...(user && { onFavoriteClick: handleFavoriteClick })}
                favorited={favoritedRecipesId.has(meal.apiId)}
                cardSize={300}
              />
            )}
            listItemsStyle={RowOverflowTitledListStyle}
          />
        ))}
      </Box>
      {message && (
        <ErrorState error={message.error} message={message.message} />
      )}
      <MealInfoModal
        toggleModal={() => setRecipeInfoModalOpen((prev) => !prev)}
        modalOpen={recipeInfoModalOpen}
        recipeInfo={recipeInfoModalInfo}
      />
    </Box>
  );
};

export default RecipeDiscoveryPage;
