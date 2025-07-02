import "../styles/NewListPage.css";
import type { RecipeToggleNavBar, RecipeData } from "../utils/types";
import AppHeader from "../components/AppHeader";
import MealCard from "../components/MealCard";
import MealInfoModal from "../components/MealInfoModal";
import { useState } from "react";
import AddAnotherMealModal from "../components/AddAnotherMealModal";

const NewListPage = ({ navOpen, toggleNav }: RecipeToggleNavBar) => {
  const [addAnotherMealOpen, setAddAnotherMealOpen] = useState(false);
  const [mealInfoModalOpen, setMealInfoModalOpen] = useState(false);
  const [selectedMeals, setSelectedMeals] = useState<RecipeData[]>([]);

  const handleSelectRecipe = (selectedRecipe: RecipeData) => {
    setSelectedMeals((prev) => [...prev, selectedRecipe])
  }

  return (
    <div className="new-list-page">
      <AppHeader navOpen={navOpen} toggleNav={toggleNav}/>
      <h1>Selected Meals</h1>
      <section className="selected-meals-container">
        {
            selectedMeals.map((meal) => {
                return (
                    <MealCard key={meal.id} onMealCardClick={() => event?.preventDefault()} parsedMealData={meal} />
                )
            })
          }
      </section>
      <section>
        <button onClick={() => setAddAnotherMealOpen((prev) => !prev)}>Add Another Meal!</button>
        <button>Make My List</button>
      </section>
      {addAnotherMealOpen && <AddAnotherMealModal handleModalClose={() => setAddAnotherMealOpen((prev) => !prev)} onSelectRecipe={handleSelectRecipe}/>}
      {mealInfoModalOpen && (
        <MealInfoModal
          handleModalClose={() => setMealInfoModalOpen((prev) => !prev)}
        />
      )}
    </div>
  );
};

export default NewListPage;
