import React from "react";
import { Box, Typography } from "@mui/joy";
import type { GPRecipeDataTypes } from "../utils/types";

const DietsAndIntolerances = ({recipeInfo}: {recipeInfo: GPRecipeDataTypes | undefined}) => {
  const listItemStyle = {
    m: 1,
    p: 1,
    backgroundColor: "#d9edf8",
    borderRadius: "md",
    textAlign: "center",
  };

  return (
    <Box sx={{ display: "flex" }}>
      {recipeInfo?.dairyFree && (
        <Typography sx={listItemStyle}>Dairy Free</Typography>
      )}
      {recipeInfo?.glutenFree && (
        <Typography sx={listItemStyle}>Gluten Free</Typography>
      )}
      {recipeInfo?.vegetarian && (
        <Typography sx={listItemStyle}>Vegetarian</Typography>
      )}
      {recipeInfo?.vegan && <Typography sx={listItemStyle}>Vegan</Typography>}
    </Box>
  );
};

export default DietsAndIntolerances;
