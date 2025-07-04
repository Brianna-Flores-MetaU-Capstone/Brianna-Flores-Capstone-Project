import React from "react";
import NavBar from "./NavBar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import type { GPToggleNavBarProps } from "../utils/types";

import { auth } from "../utils/firebase";
import { signOut } from "firebase/auth";
import { useNavigate } from "react-router";
import "../styles/Homepage.css";
import Button from "@mui/material/Button";

const AppHeader: React.FC<GPToggleNavBarProps> = ({ navOpen, toggleNav }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    signOut(auth).catch((error) => {});
  };

  const handleLogin = () => {
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
      {/* TODO make a better name */}
      <h1>Grociplan</h1>
      <div className="auth-access-buttons">
        <Button onClick={handleLogout}>Logout</Button>
        <Button onClick={handleLogin}>Login</Button>
      </div>
      <NavBar toggleNav={toggleNav} navOpen={navOpen} />
    </section>
  );
};

export default AppHeader;
