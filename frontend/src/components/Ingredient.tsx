import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare, faTrash } from "@fortawesome/free-solid-svg-icons";
import type {
  GPIngredientApiInfoType,
  GPIngredientDataTypes,
} from "../utils/types";
import {
  Box,
  ButtonGroup,
  Checkbox,
  Grid,
  IconButton,
  Typography,
} from "@mui/joy";

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
    parseInt(ingredient.quantity.toString()) % 1 === 0
      ? ingredient.quantity
      : ingredient.quantity.toFixed(2);
  return (
    <Box sx={{ bgcolor: "#F7F2EF", px: 3, py: 2, borderRadius: "md"}}>
      <Grid container alignItems="center" justifyContent="space-between" spacing={2}>
        {presentGroceryCheck && (
          <Grid xs={1}>
            <Checkbox
              checked={ingredient.isChecked}
              onChange={() => onGroceryCheck?.(ingredient.ingredientName)}
            />
          </Grid>
        )}
        <Grid xs={4}>
          <Typography>{ingredient.ingredientName}</Typography>
        </Grid>
        {/* Quantity goes to 2 decimal places only if decimal */}
        <Grid xs={3}>
          <Typography>{`${formatQuantity} ${ingredient.unit}`}</Typography>
        </Grid>
        {presentExpiration && (
          <Grid xs={3}>
            <Typography>
              {ingredient.expirationDate}
            </Typography>
          </Grid>
        )}
        {ingredientCost && (
          <Grid xs={4}>
            <Typography>
              Est. ${ingredientCost.ingredientCost?.toFixed(2)}
            </Typography>
          </Grid>
        )}
        {presentButtons && (
          <Grid xs={2}>
            <ButtonGroup>
              <IconButton onClick={() => onEdit?.(ingredient)}>
                <FontAwesomeIcon icon={faPenToSquare} />
              </IconButton>
              <IconButton onClick={() => onDelete?.(ingredient)}>
                <FontAwesomeIcon icon={faTrash} />
              </IconButton>
            </ButtonGroup>
          </Grid>
        )}
      </Grid>
    </Box>
  );
};

export default Ingredient;
