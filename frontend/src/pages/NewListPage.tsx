import "../styles/NewListPage.css";
import NavBar from "../components/NavBar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import type { navigationTypes } from "../utils/types";
import MealCard from "../components/MealCard";
import MealInfoModal from "../components/MealInfoModal";
import {useState} from 'react'

const NewListPage = ({ navOpen, toggleNav }: navigationTypes) => {
  const [addAnotherMealOpen, setAddAnotherMealOpen] = useState(false);
  const [mealInfoModalOpen, setMealInfoModalOpen] = useState(false);
  return (
    <div>
      <button onClick={toggleNav}>
        <FontAwesomeIcon icon={faBars} className="nav-icon" />
      </button>
      {navOpen && <NavBar toggleNav={toggleNav} />} 
      <h1>Chosen Meals</h1>
      <MealCard onMealCardClick={() => setMealInfoModalOpen((prev) => !prev)}/>
      {mealInfoModalOpen && <MealInfoModal handleModalClose={() => setMealInfoModalOpen((prev) => !prev)} />}
    </div>
  );
};

export default NewListPage;
