import "../styles/IngredientsPage.css";
import NavBar from "../components/NavBar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import type {navigationTypes} from '../utils/types'

const IngredientsPage = ( {navOpen, toggleNav} : navigationTypes) => {
  return (
    <div>
      <button onClick={toggleNav}>
        <FontAwesomeIcon
          icon={faBars}
          className="nav-icon"
        />
      </button>
      {navOpen && <NavBar toggleNav={toggleNav} />} IngredientsPage
    </div>
  );
};

export default IngredientsPage;
