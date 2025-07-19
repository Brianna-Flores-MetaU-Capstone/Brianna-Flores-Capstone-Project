import { Box, Typography } from "@mui/joy";
import type { GPRecipeDataTypes } from "../utils/types";

const DietsAndIntolerances = ({
  recipeInfo,
}: {
  recipeInfo: GPRecipeDataTypes | undefined;
}) => {
  const listItemStyle = {
    m: 1,
    p: 1,
    border: "2px solid",
    borderRadius: "md",
    textAlign: "center",
    alignSelf: "center",
    color: "primary.400"
  };

  return (
    <Box sx={{ display: "flex", justifyContent: "center"}}>
      {recipeInfo?.dairyFree && (
        <Typography level="body-xs" sx={listItemStyle}>
          Dairy Free
        </Typography>
      )}
      {recipeInfo?.glutenFree && (
        <Typography level="body-xs" sx={listItemStyle}>
          Gluten Free
        </Typography>
      )}
      {recipeInfo?.vegetarian && (
        <Typography level="body-xs" sx={listItemStyle}>
          Vegetarian
        </Typography>
      )}
      {recipeInfo?.vegan && (
        <Typography level="body-xs" sx={listItemStyle}>
          Vegan
        </Typography>
      )}
    </Box>
  );
};

export default DietsAndIntolerances;
