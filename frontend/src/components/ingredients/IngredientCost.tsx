import type { IngredientData } from "../../../../shared/IngredientData";
import { Box, Grid, Typography } from "@mui/joy";

type GPIngredientCostTypes = {
  ingredientCostInfo: IngredientData;
};

const IngredientCost = ({ ingredientCostInfo }: GPIngredientCostTypes) => {
  return (
    <Box sx={{ bgcolor: "#F7F2EF", px: 3, py: 2, borderRadius: "md" }}>
      <Grid container alignItems="center">
        <Grid container xs={4}>
          <Grid xs={11}>
            <Typography>{ingredientCostInfo.ingredientName}</Typography>
          </Grid>
        </Grid>
        <Grid xs={4}>
          <Typography>
            {ingredientCostInfo.quantity} {ingredientCostInfo.unit}
          </Typography>
        </Grid>
        <Grid xs={2}>
          <Typography>
            ${ingredientCostInfo.ingredientCost?.toFixed(2)}
          </Typography>
        </Grid>
        <Grid xs={2}>
          <Typography>{ingredientCostInfo.ingredientCostUnit}</Typography>
        </Grid>
      </Grid>
    </Box>
  );
};

export default IngredientCost;
