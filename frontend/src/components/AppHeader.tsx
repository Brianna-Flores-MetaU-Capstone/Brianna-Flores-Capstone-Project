import React from "react";
import NavBar from "./NavBar";
import { useNavigate } from "react-router";
import "../styles/Homepage.css";
import { useUser } from "../contexts/UserContext";
import { useLocation } from "react-router";
import { Button, Box, Grid, Typography } from "@mui/joy";

const AppHeader = () => {
  const { user } = useUser();
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <Grid container sx={{ p: 3, bgcolor: "primary.300", alignItems: "center" }}>
      <Grid xs={1}>
        <NavBar />
      </Grid>
      <Grid xs={10} textAlign="center">
        <Typography level="h1">Grociplan</Typography>
      </Grid>
      <Grid xs={1}>
        {user ? (
          <Typography>Welcome</Typography>
        ) : (
          location.pathname !== "/login" && (
            <Button color="neutral" onClick={() => navigate("/login")}>
              Login
            </Button>
          )
        )}
      </Grid>
    </Grid>
  );
};

export default AppHeader;
