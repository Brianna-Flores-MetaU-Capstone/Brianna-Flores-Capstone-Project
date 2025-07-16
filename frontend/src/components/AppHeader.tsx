import React from "react";
import NavBar from "./NavBar";
import { useNavigate } from "react-router";
import "../styles/Homepage.css";
import Button from "@mui/joy/Button";
import { useUser } from "../contexts/UserContext";
import { useLocation } from "react-router";

const AppHeader = () => {
  const { user } = useUser();
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <section className="app-header">
      <NavBar />
      <h1>Grociplan</h1>
      <div className="auth-access-buttons">
        {user ? (
          <p>Welcome</p>
        ) : (
          location.pathname !== "/login" && (
            <Button onClick={() => navigate("/login")}>Login</Button>
          )
        )}
      </div>
    </section>
  );
};

export default AppHeader;
