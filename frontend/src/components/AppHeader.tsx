import React from "react"
import NavBar from "./NavBar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import type {RecipeToggleNavBar} from "../utils/types"

const AppHeader = ({navOpen, toggleNav}: RecipeToggleNavBar) => {
  return (
    <section className="app-header">
      <header>
        <h1>Grocery Buddy *insert better title lol*</h1>
      </header>
      <button className="nav-button" onClick={toggleNav}>
        <FontAwesomeIcon icon={faBars} className="nav-icon" />
      </button>
      <NavBar toggleNav={toggleNav} navOpen={navOpen} />
    </section>
  );
};

export default AppHeader;
