import "../styles/NewListPage.css";
import type {
  GPToggleNavBarProps,
  GPRecipeDataTypes,
  GPErrorMessageTypes,
  GPRecipeIngredientTypes,
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
import {
  fetchRecipes,
  updateUserRecipes,
  fetchUserIngredientsHelper,
} from "../utils/databaseHelpers";
import { useNavigate } from "react-router";
import LoadingModal from "../components/LoadingModal";
import axios from "axios";
import { axiosConfig } from "../utils/databaseHelpers";

const databaseUrl = import.meta.env.VITE_DATABASE_URL;

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
  const [loadingList, setLoadingList] = useState(false);
  const { user } = useUser();
  const navigate = useNavigate();

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
    try {
      await axios.put(
        `${databaseUrl}/recipes/${deletedRecipe.apiId}`,
        {},
        axiosConfig
      );
      await fetchRecipes({ setMessage, setSelectedRecipes });
    } catch (error) {
      setMessage({ error: true, message: "Failed to delete recipe" });
    }
  };

  const getRecipeIngredients = (recipes: GPRecipeDataTypes[]) => {
    let recipeIngredients: GPRecipeIngredientTypes[] = [];
    for (const recipe of recipes) {
      recipeIngredients = [...recipeIngredients, ...recipe.ingredients];
    }
    return recipeIngredients;
  };

  const handleGenerateList = async () => {
    setLoadingList(true);
    const ingredientsOnHand = await fetchUserIngredientsHelper({ setMessage });
    const recipeIngredients = getRecipeIngredients(selectedRecipes);

    try {
      await axios.post(
        `${databaseUrl}/generateList/${user?.id}`,
        { ingredientsOnHand, recipeIngredients },
        axiosConfig
      );
      navigate("/grocery-list");
    } catch (error) {
      setMessage({ error: true, message: "Failed to generate grocery list" });
    }
  };

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
      <LoadingModal modalOpen={loadingList} />
    </div>
  );
};

export default NewListPage;
