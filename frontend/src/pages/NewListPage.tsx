import "../styles/NewListPage.css";
import NavBar from "../components/NavBar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import type { navigationTypes, recipeType } from "../utils/types";
import MealCard from "../components/MealCard";
import MealInfoModal from "../components/MealInfoModal";
import { useState } from "react";
import AddAnotherMealModal from "../components/AddAnotherMealModal";

const NewListPage = ({ navOpen, toggleNav }: navigationTypes) => {
  const [addAnotherMealOpen, setAddAnotherMealOpen] = useState(false);
  const [mealInfoModalOpen, setMealInfoModalOpen] = useState(false);
  const [selectedMeals, setSelectedMeals] = useState<recipeType[]>([]);

  const handleSelectRecipe = (selectedRecipe: recipeType) => {
    setSelectedMeals((prev) => [...prev, selectedRecipe])
  }

  return (
    <div className="new-list-page">
      <button onClick={toggleNav}>
        <FontAwesomeIcon icon={faBars} className="nav-icon" />
      </button>
      {navOpen && <NavBar toggleNav={toggleNav} />}
      <h1>Selected Meals</h1>
      <section className="selected-meals-container">
        {/* use map on array of selected meals to create meal cards  */}
        {/* <MealCard
          onMealCardClick={() => setMealInfoModalOpen((prev) => !prev)}
        /> */}
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
      {/* <AddAnotherMealModal handleModalClose={() => setAddAnotherMealOpen((prev) => !prev)}/> */}
      {mealInfoModalOpen && (
        <MealInfoModal
          handleModalClose={() => setMealInfoModalOpen((prev) => !prev)}
        />
      )}
    </div>
  );
};

export default NewListPage;
