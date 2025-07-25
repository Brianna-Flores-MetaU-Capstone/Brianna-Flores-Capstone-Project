import AppHeader from "../components/utils/AppHeader";
import { Box } from "@mui/joy";
import { useState, useEffect } from "react";
import type { GPErrorMessageTypes } from "../utils/types";
import {
  fetchRecipes,
  handleUnfavoriteRecipe,
  updateUserRecipes,
} from "../utils/databaseHelpers";
import TitledListView from "../components/utils/TitledListView";
import MealCard from "../components/recipeDisplay/MealCard";
import ErrorState from "../components/utils/ErrorState";
import MealInfoModal from "../components/recipeDisplay/MealInfoModal";
import { CenteredTitledListStyle } from "../utils/UIStyle";
import { useUser } from "../contexts/UserContext";
import { Recipe } from "../../../shared/Recipe";

const FavoritedRecipes = () => {
  const [favoritedRecipes, setFavoritedRecipes] = useState<Recipe[]>([]);
  const [message, setMessage] = useState<GPErrorMessageTypes>();
  const [recipeInfoModalOpen, setRecipeInfoModalOpen] = useState(false);
  const [recipeInfoModalInfo, setRecipeInfoModalInfo] = useState<Recipe>();
  const { user } = useUser();

  useEffect(() => {
    fetchRecipes({
      setMessage,
      setRecipes: setFavoritedRecipes,
      recipeGroup: "favorited",
    });
  }, []);

  const onFavoriteClick = (recipe: Recipe) => {
    handleUnfavoriteRecipe({ setMessage, recipe });
    setFavoritedRecipes((prev) => prev.filter((elem) => elem.id !== recipe.id));
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

  return (
    <Box>
      <AppHeader />
      <Box sx={{ my: 3 }}>
        <TitledListView
          itemsList={favoritedRecipes}
          renderItem={(recipe, index) => (
            <MealCard
              key={index}
              index={index}
              favorited={true}
              onFavoriteClick={() => onFavoriteClick(recipe)}
              onMealCardClick={() => handleRecipeCardClick(recipe)}
              onSelectRecipe={() => handleSelectRecipeToShop(recipe)}
              setMessage={setMessage}
              parsedMealData={recipe}
              selectedToCompare={false}
            />
          )}
          listItemsStyle={CenteredTitledListStyle}
        />
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

export default FavoritedRecipes;
