import { Box, Typography } from "@mui/joy";
import type { GPRecipeDataTypes } from "../utils/types";
import { GPTagItemStyle } from "../utils/UIStyle";

const DietsAndIntolerances = ({
  recipeInfo,
}: {
  recipeInfo: GPRecipeDataTypes | undefined;
}) => {

  return (
    <Box sx={{ display: "flex", justifyContent: "center"}}>
      {recipeInfo?.dairyFree && (
        <Typography level="body-xs" sx={GPTagItemStyle}>
          Dairy Free
        </Typography>
      )}
      {recipeInfo?.glutenFree && (
        <Typography level="body-xs" sx={GPTagItemStyle}>
          Gluten Free
        </Typography>
      )}
      {recipeInfo?.vegetarian && (
        <Typography level="body-xs" sx={GPTagItemStyle}>
          Vegetarian
        </Typography>
      )}
      {recipeInfo?.vegan && (
        <Typography level="body-xs" sx={GPTagItemStyle}>
          Vegan
        </Typography>
      )}
    </Box>
  );
};

export default DietsAndIntolerances;
