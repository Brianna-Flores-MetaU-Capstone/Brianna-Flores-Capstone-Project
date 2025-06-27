import "../styles/NewListPage.css";
import NavBar from "../components/NavBar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import type { navigationTypes } from "../utils/types";
import MealCard from "../components/MealCard";
import MealInfoModal from "../components/MealInfoModal";

const NewListPage = ({ navOpen, toggleNav }: navigationTypes) => {
  return (
    <div>
      <button onClick={toggleNav}>
        <FontAwesomeIcon icon={faBars} className="nav-icon" />
      </button>
      {navOpen && <NavBar toggleNav={toggleNav} />} 
      <h1>Chosen Meals</h1>
      <MealCard />
      <MealInfoModal />
    </div>
  );
};

export default NewListPage;
