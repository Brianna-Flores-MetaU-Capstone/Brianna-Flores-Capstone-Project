import "../styles/NewListPage.css";
import NavBar from "../components/NavBar";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faTicket } from "@fortawesome/free-solid-svg-icons";
import type {navigationTypes} from '../utils/types'

const NewListPage = ( {navOpen, toggleNav} : navigationTypes) => {
  return (
    <div>
      <button onClick={toggleNav}>
        <FontAwesomeIcon
          icon={faBars}
          className="nav-icon"
          onClick={toggleNav}
        />
      </button>
      {navOpen && <NavBar toggleNav={toggleNav} />} NewListPage
    </div>
  );
};

export default NewListPage;
