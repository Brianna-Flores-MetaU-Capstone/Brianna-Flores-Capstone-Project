import { Box, Grid, Typography } from "@mui/joy";
import RecipeDiffTable from "./RecipeDiffTable";
import type { GPDiffReturnType } from "../../classes/recipeDiffClasses/DiffClass";
import type { GPIngredientDataTypes } from "../../utils/types";
import { GPDiffHeaderStyle } from "../../utils/UIStyle";
import type { Recipe } from "../../classes/recipe/Recipe";

type GPRecipeDiffInfo = {
  recipeA: Recipe;
  recipeB: Recipe;
  costDiff: boolean;
  diffInfo: GPDiffReturnType<GPIngredientDataTypes>;
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
            <Typography level="h4">${recipeA.totalCost.toFixed(2)}</Typography>
          )}
        </Grid>
        <Grid xs={6}>
          {costDiff && (
            <Typography level="h2">Total Estimated Cost: </Typography>
          )}
          {costDiff && (
            <Typography level="h4">${recipeB.totalCost.toFixed(2)}</Typography>
          )}
        </Grid>
      </Grid>
    </Box>
  );
};

export default RecipeDiffBlock;
