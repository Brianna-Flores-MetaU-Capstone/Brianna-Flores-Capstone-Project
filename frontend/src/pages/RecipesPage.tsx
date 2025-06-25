import "../styles/RecipesPage.css";
import { Outlet } from "react-router";
import NavBar from "../components/NavBar";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faTicket } from "@fortawesome/free-solid-svg-icons";
import type {navigationTypes} from '../utils/types'

const RecipesPage = ( {navOpen, toggleNav} : navigationTypes) => {
  return (
    <div>
      <button onClick={toggleNav}>
        <FontAwesomeIcon
          icon={faBars}
          className="nav-icon"
          onClick={toggleNav}
        />
      </button>
      {navOpen && <NavBar toggleNav={toggleNav} />}
      RecipesPage
      <Outlet />
    </div>
  );
};

export default RecipesPage;
