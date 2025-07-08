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
import { fetchRecipes, updateUserRecipes } from "../utils/databaseHelpers";

const NewListPage: React.FC<GPToggleNavBarProps> = ({ navOpen, toggleNav }) => {
  const [addAnotherMealModalOpen, setAddAnotherMealModalOpen] = useState(false);
  const [mealInfoModalOpen, setMealInfoModalOpen] = useState(false);
  const [mealInfoModalInfo, setMealInfoModalInfo] = useState<GPRecipeDataTypes>()
  const [selectedMeals, setSelectedMeals] = useState<GPRecipeDataTypes[]>([]);
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
      await fetchRecipes({ setMessage, setSelectedMeals });
    } catch (error) {
      setMessage({ error: true, message: "Error adding recipe" });
    }
  };

  useEffect(() => {
    fetchRecipes({ setMessage, setSelectedMeals });
  }, []);

  const handleMealCardClick = (recipe: GPRecipeDataTypes) => {
    setMealInfoModalOpen((prev) => !prev)
    setMealInfoModalInfo(recipe)
  }

  return (
    <div className="new-list-page">
      <AppHeader navOpen={navOpen} toggleNav={toggleNav} />
      <section>
        <Button onClick={() => setAddAnotherMealModalOpen((prev) => !prev)}>
          Add Another Meal!
        </Button>
        <Button>Make My List</Button>
      </section>
      <GenericList
        className="selected-meals"
        headerList={["Selected Meals"]}
        list={selectedMeals}
        renderItem={(meal) => (
          <MealCard
            key={meal.apiId}
            onMealCardClick={() => handleMealCardClick(meal)}
            parsedMealData={meal}
          />
        )}
      />
      {message && (
        <ErrorState error={message.error} message={message.message} />
      )}
      <AddAnotherMealModal
        handleModalClose={() => setAddAnotherMealModalOpen((prev) => !prev)}
        onSelectRecipe={handleSelectRecipe}
        modalOpen={addAnotherMealModalOpen}
      />
      <MealInfoModal
        handleModalClose={() => setMealInfoModalOpen((prev) => !prev)}
        modalOpen={mealInfoModalOpen}
        recipeInfo={mealInfoModalInfo}
      />
    </div>
  );
};

export default NewListPage;
