import "../styles/NewListPage.css";
import NavBar from "../components/NavBar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import type { navigationTypes } from "../utils/types";
import MealCard from "../components/MealCard";
import MealInfoModal from "../components/MealInfoModal";
import { useState } from "react";
import AddAnotherMealModal from "../components/AddAnotherMealModal";

const NewListPage = ({ navOpen, toggleNav }: navigationTypes) => {
  const [addAnotherMealOpen, setAddAnotherMealOpen] = useState(false);
  const [mealInfoModalOpen, setMealInfoModalOpen] = useState(false);
  const [selectedMeals, setSelectedMeals] = useState([]);
  return (
    <div className="new-list-page">
      <button onClick={toggleNav}>
        <FontAwesomeIcon icon={faBars} className="nav-icon" />
      </button>
      {navOpen && <NavBar toggleNav={toggleNav} />}
      <h1>Chosen Meals</h1>
      <section>
        {/* use map on array of selected meals to create meal cards  */}
        <MealCard
          onMealCardClick={() => setMealInfoModalOpen((prev) => !prev)}
        />
      </section>
      <section>
        <button onClick={() => setAddAnotherMealOpen((prev) => !prev)}>Add Another Meal!</button>
        <button>Make My List</button>
      </section>
      {addAnotherMealOpen && <AddAnotherMealModal handleModalClose={() => setAddAnotherMealOpen((prev) => !prev)}/>}
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
