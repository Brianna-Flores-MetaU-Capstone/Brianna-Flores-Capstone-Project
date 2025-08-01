import { Box, Grid, Typography } from "@mui/joy";
import RecipeDiffTable from "./RecipeDiffTable";
import type { GPRecipeComparisonReturnType } from "../../classes/recipeDiffClasses/DiffRecipeIngredients";
import { GPDiffHeaderStyle } from "../../utils/style/UIStyle";
import type { Recipe } from "../../../../shared/Recipe";
import type { IngredientData } from "../../../../shared/IngredientData";

type GPRecipeDiffInfo = {
  recipeA: Recipe | undefined;
  recipeB: Recipe | undefined;
  costDiff: boolean;
  diffInfo: GPRecipeComparisonReturnType<IngredientData> | undefined;
};

const RecipeDiffBlock = ({
  recipeA,
  recipeB,
  diffInfo,
  costDiff,
}: GPRecipeDiffInfo) => {
  return (
    <Box sx={{ display: "flex", flexDirection: "column" }}>
      <Typography sx={GPDiffHeaderStyle} level="h2">
        {!costDiff
          ? "Compare Recipe Ingredients"
          : "Compare Ingredients to Purchase"}
      </Typography>
      <Grid container spacing={2}>
        <Grid xs={6}>
          <RecipeDiffTable
            first={true}
            diffInfo={diffInfo}
            costDiff={costDiff}
          />
        </Grid>
        <Grid xs={6}>
          <RecipeDiffTable
            first={false}
            diffInfo={diffInfo}
            costDiff={costDiff}
          />
        </Grid>
      </Grid>
      <Grid container spacing={2}>
        <Grid xs={6}>
          {costDiff && (
            <Typography level="h2">Total Estimated Cost: </Typography>
          )}
          {costDiff && (
            <Typography level="h4">${recipeA?.totalCost.toFixed(2)}</Typography>
          )}
        </Grid>
        <Grid xs={6}>
          {costDiff && (
            <Typography level="h2">Total Estimated Cost: </Typography>
          )}
          {costDiff && (
            <Typography level="h4">${recipeB?.totalCost.toFixed(2)}</Typography>
          )}
        </Grid>
      </Grid>
    </Box>
  );
};

export default RecipeDiffBlock;
