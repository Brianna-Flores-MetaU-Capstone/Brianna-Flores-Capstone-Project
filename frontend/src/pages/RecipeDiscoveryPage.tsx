import AppHeader from "../components/utils/AppHeader";
import { Box } from "@mui/joy";
import { useState, useEffect } from "react";
import type {
  GPErrorMessageTypes,
  GPRecipeDiscoveryCategories,
} from "../utils/types";
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
} from "../utils/UIStyle";
import ErrorState from "../components/utils/ErrorState";
import MealInfoModal from "../components/recipeDisplay/MealInfoModal";
import { useUser } from "../contexts/UserContext";
import EditRecipeModal from "../components/recipeDiff/EditRecipeModal";
import { RecipeFilter } from "../classes/filters/RecipeFilters";
import { Recipe } from "../classes/recipe/Recipe";

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

  useEffect(() => {
    const setRecipeLists = async () => {
      fetchAllRecipeCategories({
        setMessage,
        setRecipeDiscoveryResults,
        offset: 0,
      });
      const favoritedRecipesReturn = await fetchRecipes({
        setMessage,
        recipeGroup: "favoritedIds",
      });
      // set favorited recipes id
      for (const elem of favoritedRecipesReturn) {
        setFavoritedRecipesId((prev) => new Set(prev.add(elem.id)));
      }
    };
    setRecipeLists();
  }, []);

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
                parsedMealData={meal}
                onMealCardClick={() => handleRecipeCardClick(meal)}
                {...(user && {
                  onSelectRecipe: () => handleSelectRecipeToShop(meal),
                })}
                {...(user && {
                  onEditRecipe: () => handleEditRecipe(meal),
                })}
                setMessage={setMessage}
                selectedToCompare={false}
                {...(user && { onFavoriteClick: handleFavoriteClick })}
                favorited={favoritedRecipesId.has(meal.id)}
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
      <EditRecipeModal
        recipe={editRecipeInfo}
        modalOpen={editRecipeModalOpen}
        toggleModal={() => setEditRecipeModalOpen((prev) => !prev)}
      />
    </Box>
  );
};

export default RecipeDiscoveryPage;
