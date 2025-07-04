import "../styles/NewListPage.css";
import type { GPToggleNavBarProps, GPRecipeDataTypes } from "../utils/types";
import AppHeader from "../components/AppHeader";
import MealCard from "../components/MealCard";
import MealInfoModal from "../components/MealInfoModal";
import { useState } from "react";
import AddAnotherMealModal from "../components/AddAnotherMealModal";
import Button from "@mui/material/Button";

const NewListPage: React.FC<GPToggleNavBarProps> = ({ navOpen, toggleNav }) => {
  const [addAnotherMealModalOpen, setAddAnotherMealModalOpen] = useState(false);
  const [mealInfoModalOpen, setMealInfoModalOpen] = useState(false);
  const [selectedMeals, setSelectedMeals] = useState<GPRecipeDataTypes[]>([]);

  const handleSelectRecipe = (selectedRecipe: GPRecipeDataTypes) => {
    setSelectedMeals((prev) => [...prev, selectedRecipe]);
  };

  return (
    <div className="new-list-page">
      <AppHeader navOpen={navOpen} toggleNav={toggleNav} />
      <h1>Selected Meals</h1>
      <section className="selected-meals-container">
        {selectedMeals.map((meal) => {
          return (
            <MealCard
              key={meal.id}
              onMealCardClick={() => event?.preventDefault()}
              parsedMealData={meal}
            />
          );
        })}
      </section>
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
