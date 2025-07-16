import React from "react";
import NavBar from "./NavBar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import type { GPToggleNavBarProps } from "../utils/types";
import { useNavigate } from "react-router";
import "../styles/Homepage.css";
import Button from "@mui/material/Button";
import { useUser } from "../contexts/UserContext";
import { useLocation } from "react-router";

const AppHeader: React.FC<GPToggleNavBarProps> = ({ navOpen, toggleNav }) => {
  const { user } = useUser();
  const navigate = useNavigate();
  const location = useLocation();

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
      <h1>Grociplan</h1>
      <div className="auth-access-buttons">
        {user ? (
          <p>Welcome</p>
        ) : (
          location.pathname !== "/login" && (
            <Button onClick={handleLogin}>Login</Button>
          )
        )}
      </div>
      <NavBar toggleNav={toggleNav} navOpen={navOpen} />
    </section>
  );
};

export default AppHeader;
