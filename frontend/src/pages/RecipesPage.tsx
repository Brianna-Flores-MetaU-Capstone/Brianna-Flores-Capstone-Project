import "../styles/RecipesPage.css";
import { Outlet } from "react-router";
import NavBar from "../components/NavBar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import type {navigationTypes} from '../utils/types'

const RecipesPage = ( {navOpen, toggleNav} : navigationTypes) => {
  return (
    <div>
      <button onClick={toggleNav}>
        <FontAwesomeIcon
          icon={faBars}
          className="nav-icon"
        />
      </button>
      {navOpen && <NavBar toggleNav={toggleNav} />}
      RecipesPage
      <Outlet />
    </div>
  );
};

export default RecipesPage;
