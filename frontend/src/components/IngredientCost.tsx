import React from "react";
import type { GPIngredientDataTypes } from "../utils/types";
import { Box, Grid, Typography } from "@mui/joy";

type GPIngredientCostTypes = {
  ingredientCostInfo: GPIngredientDataTypes;
};

const IngredientCost = ({ ingredientCostInfo }: GPIngredientCostTypes) => {
  return (
    <Box sx={{ bgcolor: "#F7F2EF", px: 3, py: 2, borderRadius: "md" }}>
      <Grid container alignItems="center">
        <Grid xs={8}>
          <Typography>
            {ingredientCostInfo.ingredientName}
          </Typography>
        </Grid>
        <Grid xs={2}>
          <Typography>
            ${ingredientCostInfo.ingredientCost?.toFixed(2)}
          </Typography>
        </Grid>
        <Grid xs={2}>
          <Typography>
            {ingredientCostInfo.ingredientCostUnit}
          </Typography>
        </Grid>
      </Grid>
    </Box>
  );
};

export default IngredientCost;
