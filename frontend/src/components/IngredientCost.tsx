import React from "react";
import type { GPIngredientCostInfoTypes } from "../../../backend/utils/utils";
import { Box, Grid, Typography } from "@mui/joy";

type GPIngredientCostTypes = {
  ingredientCostInfo: GPIngredientCostInfoTypes;
};

const IngredientCost = ({ ingredientCostInfo }: GPIngredientCostTypes) => {
  return (
    <Box sx={{ bgcolor: "#F7F2EF", px: 3, py: 2, borderRadius: "md" }}>
      <Grid container alignItems="center">
        <Grid xs={8}>
          <Typography>
            {ingredientCostInfo.ingredient.ingredientName}
          </Typography>
        </Grid>
        <Grid xs={2}>
          <Typography>
            ${ingredientCostInfo.ingredientApiInfo.ingredientCost?.toFixed(2)}
          </Typography>
        </Grid>
        <Grid xs={2}>
          <Typography>
            {ingredientCostInfo.ingredientApiInfo.ingredientAmount}
          </Typography>
        </Grid>
      </Grid>
    </Box>
  );
};

export default IngredientCost;
