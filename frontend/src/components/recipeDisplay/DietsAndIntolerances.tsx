import { Box, Typography } from "@mui/joy";
import { GPTagItemStyle } from "../../utils/style/UIStyle";
import type { Recipe } from "../../../../shared/Recipe";

const DietsAndIntolerances = ({
  recipeInfo,
}: {
  recipeInfo: Recipe | undefined;
}) => {
  return (
    <Box sx={{ display: "flex" }}>
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
