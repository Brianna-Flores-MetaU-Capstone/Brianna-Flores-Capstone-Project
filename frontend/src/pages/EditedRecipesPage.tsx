import AppHeader from "../components/utils/AppHeader";
import { Box } from "@mui/joy";
import { useState, useEffect } from "react";
import type { GPErrorMessageTypes } from "../utils/types/types";
import {
  fetchRecipes,
  handleUnfavoriteRecipe,
  handleFavoriteRecipe,
  updateUserRecipes,
} from "../utils/databaseHelpers";
import TitledListView from "../components/utils/TitledListView";
import MealCard from "../components/recipeDisplay/MealCard";
import ErrorState from "../components/utils/ErrorState";
import MealInfoModal from "../components/recipeDisplay/MealInfoModal";
import { CenteredTitledListStyle } from "../utils/style/UIStyle";
import { useUser } from "../contexts/UserContext";
import { Recipe } from "../../../shared/Recipe";
import { RecipeFetchEnum } from "../utils/constants";

const EditedRecipesPage = () => {
  const [userEditedRecipes, setUserEditedRecipes] = useState<Recipe[]>([]);
  const [favoritedRecipesId, setFavoritedRecipesId] = useState<Set<number>>(
    new Set(),
  );
  const [message, setMessage] = useState<GPErrorMessageTypes>();
  const [recipeInfoModalOpen, setRecipeInfoModalOpen] = useState(false);
  const [recipeInfoModalInfo, setRecipeInfoModalInfo] = useState<Recipe>();
  const { user } = useUser();

  useEffect(() => {
    setupEditedRecipesPage();
  }, []);

  const setupEditedRecipesPage = async () => {
    await fetchRecipes({
      setMessage,
      setRecipes: setUserEditedRecipes,
      recipeGroup: RecipeFetchEnum.EDITED,
    });
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

  return (
    <Box>
      <AppHeader />
      <Box sx={{ my: 3 }}>
        {message && (
          <ErrorState error={message.error} message={message.message} />
        )}
        <TitledListView
          itemsList={userEditedRecipes}
          renderItem={(recipe, index) => (
            <MealCard
              key={index}
              index={index}
              favorited={favoritedRecipesId.has(recipe.id)}
              onFavoriteClick={() => handleFavoriteClick(recipe)}
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
      <MealInfoModal
        toggleModal={() => setRecipeInfoModalOpen((prev) => !prev)}
        modalOpen={recipeInfoModalOpen}
        recipeInfo={recipeInfoModalInfo}
      />
    </Box>
  );
};

export default EditedRecipesPage;
