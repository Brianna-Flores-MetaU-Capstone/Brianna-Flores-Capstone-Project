import "../styles/NewListPage.css";
import NavBar from "../components/NavBar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import type {navigationTypes} from '../utils/types'

const NewListPage = ( {navOpen, toggleNav} : navigationTypes) => {
  return (
    <div>
      <button onClick={toggleNav}>
        <FontAwesomeIcon
          icon={faBars}
          className="nav-icon"
        />
      </button>
      {navOpen && <NavBar toggleNav={toggleNav} />} NewListPage
    </div>
  );
};

export default NewListPage;
