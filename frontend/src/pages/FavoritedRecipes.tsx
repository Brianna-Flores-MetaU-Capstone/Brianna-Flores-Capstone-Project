import AppHeader from "../components/AppHeader";
import { Box } from "@mui/joy";
import { useState, useEffect } from "react";
import type { GPErrorMessageTypes, GPRecipeDataTypes } from "../utils/types";
import {
  fetchRecipes,
  handleUnfavoriteRecipe,
  updateUserRecipes,
} from "../utils/databaseHelpers";
import TitledListView from "../components/TitledListView";
import MealCard from "../components/MealCard";
import ErrorState from "../components/ErrorState";
import MealInfoModal from "../components/MealInfoModal";
import { CenteredTitledListStyle } from "../utils/UIStyle";
import { useUser } from "../contexts/UserContext";

const FavoritedRecipes = () => {
  const [favoritedRecipes, setFavoritedRecipes] = useState<GPRecipeDataTypes[]>(
    []
  );
  const [message, setMessage] = useState<GPErrorMessageTypes>();
  const [recipeInfoModalOpen, setRecipeInfoModalOpen] = useState(false);
  const [recipeInfoModalInfo, setRecipeInfoModalInfo] =
    useState<GPRecipeDataTypes>();
  const { user } = useUser();

  useEffect(() => {
    fetchRecipes({
      setMessage,
      setRecipes: setFavoritedRecipes,
      recipeGroup: "favorited",
    });
  }, []);

  const onFavoriteClick = (meal: GPRecipeDataTypes) => {
    handleUnfavoriteRecipe({ setMessage, recipe: meal });
    setFavoritedRecipes((prev) =>
      prev.filter((recipe) => recipe.apiId !== meal.apiId)
    );
  };

  const handleRecipeCardClick = (meal: GPRecipeDataTypes) => {
    setRecipeInfoModalOpen((prev) => !prev);
    setRecipeInfoModalInfo(meal);
  };

  const handleSelectRecipeToShop = async (meal: GPRecipeDataTypes) => {
    if (!user) {
      setMessage({ error: true, message: "Error user not signed in" });
      return;
    }
    try {
      const userId = user.id;
      await updateUserRecipes({ userId, selectedRecipe: meal, setMessage });
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
          renderItem={(meal, index) => (
            <MealCard
              key={index}
              index={index}
              favorited={true}
              onFavoriteClick={() => onFavoriteClick(meal)}
              onMealCardClick={() => handleRecipeCardClick(meal)}
              onSelectRecipe={() => handleSelectRecipeToShop(meal)}
              setMessage={setMessage}
              parsedMealData={meal}
              selectedToCompare={false}
              cardSize={350}
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
