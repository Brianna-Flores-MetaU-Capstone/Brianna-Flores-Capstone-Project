import React from "react"
import NavBar from "./NavBar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import type {RecipeToggleNavBar} from "../utils/types"

import { auth } from "../utils/firebase"
import { signOut } from "firebase/auth";
import { useNavigate } from "react-router";
import "../styles/Homepage.css"

const AppHeader = ({navOpen, toggleNav}: RecipeToggleNavBar) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    signOut(auth).catch((error) => {
      
    })
  }

  const handleLoginClick = () => {
    if (navOpen) {
      toggleNav();
    }
    navigate("/login");
  };

  return (
    <section className="app-header">
      <button className="nav-button" onClick={toggleNav}>
        <FontAwesomeIcon icon={faBars} className="nav-icon" />
      </button>
      <h1>Grocery Buddy *make a better name lol*</h1>
      <div className="auth-access-buttons">
        <button className="login-button" onClick={handleLogout}>Logout</button>
        <button className="login-button" onClick={handleLoginClick}>Login</button>
      </div>
      <NavBar toggleNav={toggleNav} navOpen={navOpen} />
    </section>
  );
};

export default AppHeader;
