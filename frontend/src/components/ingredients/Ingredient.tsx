import React from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import {
  Box,
  ButtonGroup,
  Checkbox,
  Grid,
  IconButton,
  Typography,
  Link,
} from "@mui/joy";
import type { IngredientData } from "../../../../shared/IngredientData";

const GRID_NAME_SPACING = 4;
const GRID_EXP_QUANT_COST_SPACING = 3;
const GRID_BUTTON_SPACING = 1;

const GPIngredientStyle = {
  bgcolor: "#F7F2EF",
  px: 3,
  py: 2,
  borderRadius: "md",
};

type GPIngredientProps = {
  ingredient: IngredientData;
  presentGroceryCheck: boolean;
  presentExpiration: boolean;
  presentButtons: boolean;
  onGroceryCheck?: (ingredientName: string) => void;
  onGroceryDelete?: (ingredientName: string) => void;
  onEdit?: (ingredient: IngredientData) => void;
  onDelete?: (ingredient: IngredientData) => void;
};

const Ingredient: React.FC<GPIngredientProps> = ({
  ingredient,
  presentGroceryCheck,
  presentExpiration,
  presentButtons,
  onGroceryCheck,
  onGroceryDelete,
  onEdit,
  onDelete,
}) => {
  const formatQuantity =
    parseFloat(ingredient.quantity?.toString()) % 1 === 0
      ? ingredient.quantity
      : Number(ingredient.quantity).toFixed(2);
  return (
    <Box sx={GPIngredientStyle}>
      <Grid container alignItems="center">
        {presentGroceryCheck && (
          <Grid xs={1}>
            <Checkbox
              checked={ingredient.isChecked}
              onChange={() => onGroceryCheck?.(ingredient.ingredientName)}
            />
          </Grid>
        )}
        <Grid xs={GRID_NAME_SPACING}>
          {ingredient.ingredientWalmartId > 0 && presentGroceryCheck ? (
            <Link
              href={`https://www.walmart.com/ip/${ingredient.ingredientWalmartId}`}
            >
              {ingredient.ingredientName}
            </Link>
          ) : (
            <Typography>{ingredient.ingredientName}</Typography>
          )}
        </Grid>
        <Grid xs={GRID_EXP_QUANT_COST_SPACING}>
          <Typography>{`${formatQuantity} ${ingredient.unit}`}</Typography>
        </Grid>
        {presentExpiration && (
          <Grid xs={GRID_EXP_QUANT_COST_SPACING}>
            <Typography>{ingredient.expirationDate}</Typography>
          </Grid>
        )}
        {ingredient.ingredientCostUnit && (
          <Grid xs={GRID_EXP_QUANT_COST_SPACING}>
            <Typography>
              {ingredient.ingredientCost > 0
                ? `Est. $${ingredient.ingredientCost.toFixed(2)}`
                : ingredient.ingredientCostUnit}
            </Typography>
          </Grid>
        )}
        <Grid xs={GRID_BUTTON_SPACING}>
          {presentButtons && (
            <ButtonGroup spacing={2}>
              <IconButton onClick={() => onEdit?.(ingredient)}>
                <EditIcon />
              </IconButton>
              <IconButton onClick={() => onDelete?.(ingredient)}>
                <DeleteIcon />
              </IconButton>
            </ButtonGroup>
          )}
          {onGroceryDelete && (
            <IconButton
              onClick={() => onGroceryDelete(ingredient.ingredientName)}
            >
              <DeleteIcon />
            </IconButton>
          )}
        </Grid>
      </Grid>
    </Box>
  );
};

export default Ingredient;
