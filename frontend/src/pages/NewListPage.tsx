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

const NewListPage: React.FC<GPToggleNavBarProps> = ({ navOpen, toggleNav }) => {
  const [addAnotherMealModalOpen, setAddAnotherMealModalOpen] = useState(false);
  const [mealInfoModalOpen, setMealInfoModalOpen] = useState(false);
  const [selectedMeals, setSelectedMeals] = useState<GPRecipeDataTypes[]>([]);
  const [message, setMessage] = useState<GPErrorMessageTypes>();

  const handleSelectRecipe = (selectedRecipe: GPRecipeDataTypes) => {
    setSelectedMeals((prev) => [...prev, selectedRecipe]);
  };

  useEffect(() => {
    fetchRecipes();
  }, []);

  const fetchRecipes = async () => {
    try {
      const response = await fetch("http://localhost:3000/recipes", {
        method: "GET",
        credentials: "include",
      });
      if (!response.ok) {
        setMessage({ error: true, message: "Failed to fetch user recipes" });
        return;
      }
      const data = await response.json();
      setSelectedMeals(data);
      return data;
    } catch (error) {
      setMessage({ error: true, message: "Failed to fetch user recipes" });
    }
  };

  return (
    <div className="new-list-page">
      <AppHeader navOpen={navOpen} toggleNav={toggleNav} />
      <GenericList
        className="selected-meals"
        headerList={["Selected Meals"]}
        list={selectedMeals}
        renderItem={(meal) => (
          <MealCard
            key={meal.id}
            onMealCardClick={() => event?.preventDefault()}
            parsedMealData={meal}
          />
        )}
      />
      {message && (
        <ErrorState error={message.error} message={message.message} />
      )}
      <section>
        <Button onClick={() => setAddAnotherMealModalOpen((prev) => !prev)}>
          Add Another Meal!
        </Button>
        <Button>Make My List</Button>
      </section>
      <AddAnotherMealModal
        handleModalClose={() => setAddAnotherMealModalOpen((prev) => !prev)}
        onSelectRecipe={handleSelectRecipe}
        modalOpen={addAnotherMealModalOpen}
      />
      <MealInfoModal
        handleModalClose={() => setMealInfoModalOpen((prev) => !prev)}
        modalOpen={mealInfoModalOpen}
      />
    </div>
  );
};

export default NewListPage;
