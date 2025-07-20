import React from "react";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router";
import {
  Box,
  Typography,
  ModalClose,
  List,
  Drawer,
  IconButton,
  ListItemButton,
} from "@mui/joy";
import Menu from "@mui/icons-material/Menu";

const NavBar = () => {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const pages = [
    { name: "Home", path: "/" },
    { name: "Recipes to Shop", path: "/new-list" },
    { name: "Owned Ingredients", path: "/ingredients" },
    { name: "Grocery List", path: "/grocery-list" },
    { name: "Discover Recipes", path: "/discovery" },
    { name: "Favorited Recipes", path: "/favorited" },
    { name: "Account", path: "/account" },
  ];

  return (
    // code referenced from MUI documentation: https://mui.com/joy-ui/react-drawer/
    <React.Fragment>
      <IconButton
        variant="outlined"
        color="neutral"
        onClick={() => setOpen(true)}
        sx={{ zIndex: "1" }}
      >
        <Menu />
      </IconButton>
      <Drawer open={open} onClose={() => setOpen(false)}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 0.5,
            ml: "auto",
            mt: 1,
            mr: 2,
          }}
        >
          <Typography
            component="label"
            htmlFor="close-icon"
            sx={{ fontSize: "sm", fontWeight: "lg", cursor: "pointer" }}
          >
            Close
          </Typography>
          <ModalClose id="close-icon" sx={{ position: "initial" }} />
        </Box>
        <List
          size="lg"
          component="nav"
          sx={{
            flex: "none",
            fontSize: "xl",
            "& > div": { justifyContent: "center" },
          }}
        >
          {pages.map((pageInfo) => {
            return (
              <ListItemButton
                key={pageInfo.name}
                onClick={() => {
                  navigate(pageInfo.path);
                  setOpen(false);
                }}
                sx={{
                  fontWeight: location.pathname === pageInfo.path ? "lg" : "rg",
                }}
              >
                {pageInfo.name}
              </ListItemButton>
            );
          })}
        </List>
      </Drawer>
    </React.Fragment>
  );
};

export default NavBar;
