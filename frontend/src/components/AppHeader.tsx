import React from "react";
import NavBar from "./NavBar";
import { useNavigate } from "react-router";
import "../styles/Homepage.css";
import Button from "@mui/joy/Button";
import { useUser } from "../contexts/UserContext";
import { useLocation } from "react-router";
import { Box, Typography } from "@mui/joy";

const AppHeader = () => {
  const { user } = useUser();
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", p: 3, bgcolor: "primary.300"}}>
      <NavBar />
      <Typography level="h1">Grociplan</Typography>
      <Box>
        {user ? (
          <Typography>Welcome</Typography>
        ) : (
          location.pathname !== "/login" && (
            <Button onClick={() => navigate("/login")}>Login</Button>
          )
        )}
      </Box>
    </Box>
  );
};

export default AppHeader;
