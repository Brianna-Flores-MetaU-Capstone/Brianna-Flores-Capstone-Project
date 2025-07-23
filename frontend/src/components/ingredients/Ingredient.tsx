import React from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import type {
  GPIngredientApiInfoType,
  GPIngredientDataTypes,
} from "../../utils/types/types";
import {
  Box,
  ButtonGroup,
  Checkbox,
  Grid,
  IconButton,
  Typography,
} from "@mui/joy";

const GRID_NAME_COST_SPACING = 4;
const GRID_EXP_QUANT_SPACING = 3;
const GRID_BUTTON_SPACING = 1;

type GPIngredientProps = {
  ingredient: GPIngredientDataTypes;
  presentGroceryCheck: boolean;
  presentExpiration: boolean;
  presentButtons: boolean;
  ingredientCost?: GPIngredientApiInfoType;
  onGroceryCheck?: (ingredientName: string) => void;
  onEdit?: (ingredient: GPIngredientDataTypes) => void;
  onDelete?: (ingredient: GPIngredientDataTypes) => void;
};

const Ingredient: React.FC<GPIngredientProps> = ({
  ingredient,
  presentGroceryCheck,
  presentExpiration,
  ingredientCost,
  presentButtons,
  onGroceryCheck,
  onEdit,
  onDelete,
}) => {
  const formatQuantity =
    parseFloat(ingredient.quantity?.toString()) % 1 === 0
      ? ingredient.quantity
      : Number(ingredient.quantity).toFixed(2);
  return (
    <Box sx={{ bgcolor: "#F7F2EF", px: 3, py: 2, borderRadius: "md" }}>
      <Grid
        container
        alignItems="center"
      >
        {presentGroceryCheck && (
          <Grid xs={1}>
            <Checkbox
              checked={ingredient.isChecked}
              onChange={() => onGroceryCheck?.(ingredient.ingredientName)}
            />
          </Grid>
        )}
        <Grid xs={GRID_NAME_COST_SPACING}>
          <Typography>{ingredient.ingredientName}</Typography>
        </Grid>
        <Grid xs={GRID_EXP_QUANT_SPACING}>
          <Typography>{`${formatQuantity} ${ingredient.unit}`}</Typography>
        </Grid>
        {presentExpiration && (
          <Grid xs={GRID_EXP_QUANT_SPACING}>
            <Typography>{ingredient.expirationDate}</Typography>
          </Grid>
        )}
        {ingredientCost && (
          <Grid xs={GRID_NAME_COST_SPACING}>
            <Typography>
              Est. ${ingredientCost.ingredientCost?.toFixed(2)}
            </Typography>
          </Grid>
        )}
        {presentButtons && (
          <Grid xs={GRID_BUTTON_SPACING}>
            <ButtonGroup spacing={2}>
              <IconButton onClick={() => onEdit?.(ingredient)}>
                <EditIcon />
              </IconButton>
              <IconButton onClick={() => onDelete?.(ingredient)}>
                <DeleteIcon />
              </IconButton>
            </ButtonGroup>
          </Grid>
        )}
      </Grid>
    </Box>
  );
};

export default Ingredient;
