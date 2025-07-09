import "../styles/NewListPage.css";
import type {
  GPToggleNavBarProps,
  GPRecipeDataTypes,
  GPErrorMessageTypes,
} from "../utils/types";
import AppHeader from "../components/AppHeader";
import MealCard from "../components/MealCard";
import MealInfoModal from "../components/MealInfoModal";
import { useState, useEffect } from "react";
import AddAnotherMealModal from "../components/AddAnotherMealModal";
import Button from "@mui/material/Button";
import GenericList from "../components/GenericList";
import ErrorState from "../components/ErrorState";
import { useUser } from "../contexts/UserContext";
import { fetchRecipes, updateUserRecipes, fetchUserIngredientsHelper } from "../utils/databaseHelpers";
import { createGroceryList } from "../utils/listHandler";

const NewListPage: React.FC<GPToggleNavBarProps> = ({ navOpen, toggleNav }) => {
  const [addAnotherRecipeModalOpen, setAddAnotherRecipeModalOpen] =
    useState(false);
  const [recipeInfoModalOpen, setRecipeInfoModalOpen] = useState(false);
  const [recipeInfoModalInfo, setRecipeInfoModalInfo] =
    useState<GPRecipeDataTypes>();
  const [selectedRecipes, setSelectedRecipes] = useState<GPRecipeDataTypes[]>(
    []
  );
  const [message, setMessage] = useState<GPErrorMessageTypes>();
  const { user } = useUser();

  const handleSelectRecipe = async (selectedRecipe: GPRecipeDataTypes) => {
    if (!user) {
      setMessage({ error: true, message: "Error user not signed in" });
      return;
    }
    try {
      const userId = user.id;
      await updateUserRecipes({ userId, selectedRecipe, setMessage });
      await fetchRecipes({ setMessage, setSelectedRecipes });
    } catch (error) {
      setMessage({ error: true, message: "Error adding recipe" });
    }
  };

  useEffect(() => {
    fetchRecipes({ setMessage, setSelectedRecipes });
  }, []);

  const handleRecipeCardClick = (recipe: GPRecipeDataTypes) => {
    setRecipeInfoModalOpen((prev) => !prev);
    setRecipeInfoModalInfo(recipe);
  };

  const handleDeleteRecipe = async (deletedRecipe: GPRecipeDataTypes) => {
    // take the current recipes we have
    const updatedUser = await fetch(
      `http://localhost:3000/recipes/${deletedRecipe.apiId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      }
    );
    if (!updatedUser.ok) {
      setMessage({ error: true, message: "Failed to delete recipe" });
    }
    await fetchRecipes({ setMessage, setSelectedRecipes })
  };

  const handleGenerateList = async () => {
    const ingredientsOnHand = await fetchUserIngredientsHelper({setMessage})
    createGroceryList({selectedRecipes, ingredientsOnHand})
  }

  return (
    <div className="new-list-page">
      <AppHeader navOpen={navOpen} toggleNav={toggleNav} />
      <section>
        <Button onClick={() => setAddAnotherRecipeModalOpen((prev) => !prev)}>
          Add Another Meal!
        </Button>
        <Button onClick={handleGenerateList}>Make My List</Button>
      </section>
      <GenericList
        className="selected-meals"
        headerList={["Selected Meals"]}
        list={selectedRecipes}
        renderItem={(meal) => (
          <MealCard
            key={meal.apiId}
            onMealCardClick={() => handleRecipeCardClick(meal)}
            parsedMealData={meal}
            onDeleteRecipe={handleDeleteRecipe}
          />
        )}
      />
      {message && (
        <ErrorState error={message.error} message={message.message} />
      )}
      <AddAnotherMealModal
        handleModalClose={() => setAddAnotherRecipeModalOpen((prev) => !prev)}
        onSelectRecipe={handleSelectRecipe}
        modalOpen={addAnotherRecipeModalOpen}
      />
      <MealInfoModal
        handleModalClose={() => setRecipeInfoModalOpen((prev) => !prev)}
        modalOpen={recipeInfoModalOpen}
        recipeInfo={recipeInfoModalInfo}
      />
    </div>
  );
};

export default NewListPage;
