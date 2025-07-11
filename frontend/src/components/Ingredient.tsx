import React from "react";
import "../styles/Homepage.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare, faTrash } from "@fortawesome/free-solid-svg-icons";
import type {
  GPIngredientApiInfoType,
  GPIngredientDataTypes,
} from "../utils/types";

type GPIngredientProps = {
  ingredient: GPIngredientDataTypes;
  presentGroceryCheck: boolean;
  presentExpiration: boolean;
  presentButtons: boolean;
  ingredientCost?: GPIngredientApiInfoType;
  onEdit?: (ingredient: GPIngredientDataTypes) => void;
  onDelete?: (ingredient: GPIngredientDataTypes) => void;
};

const Ingredient: React.FC<GPIngredientProps> = ({
  ingredient,
  presentGroceryCheck,
  presentExpiration,
  ingredientCost,
  presentButtons,
  onEdit,
  onDelete,
}) => {
  return (
    <div className="list-ingredient">
      {presentGroceryCheck && <input type="checkbox" />}
      <p className="ingredient-name">{ingredient.ingredientName}</p>
      {/* Quantity goes to 2 decimal places only if decimal */}
      <p className="ingredient-amount">{`${
        ingredient.quantity % 1 === 0
          ? ingredient.quantity
          : ingredient.quantity.toFixed(2)
      } ${ingredient.unit}`}</p>
      {presentExpiration && (
        <p className="ingredient-expiration">{ingredient.expirationDate}</p>
      )}
      {ingredientCost && (
        <p className="ingredient-cost">
          Est. ${ingredientCost.ingredientCost?.toFixed(2)}
        </p>
      )}
      {presentButtons && (
        <div className="ingredient-buttons-container">
          <FontAwesomeIcon
            icon={faPenToSquare}
            className="ingredient-button"
            onClick={() => onEdit?.(ingredient)}
          />
          <FontAwesomeIcon
            icon={faTrash}
            className="ingredient-button"
            onClick={() => onDelete?.(ingredient)}
          />
        </div>
      )}
    </div>
  );
};

export default Ingredient;
