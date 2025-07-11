import React from "react";
import "../styles/Homepage.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare, faTrash } from "@fortawesome/free-solid-svg-icons";
import type { GPIngredientDataTypes } from "../utils/types";

type GPIngredientProps = {
  ingredient: GPIngredientDataTypes;
  groceryCheck: boolean;
  presentExpiration: boolean;
  presentButtons: boolean;
  onEdit?: (ingredient: GPIngredientDataTypes) => void;
  onDelete?: (ingredient: GPIngredientDataTypes) => void;
};

const Ingredient: React.FC<GPIngredientProps> = ({
  ingredient,
  groceryCheck,
  presentExpiration,
  presentButtons,
  onEdit,
  onDelete,
}) => {
  return (
    <div className="list-ingredient">
      {groceryCheck && <input type="checkbox" />}
      <p className="ingredient-name">{ingredient.ingredientName}</p>
      <p className="ingredient-amount">{`${ingredient.quantity} ${ingredient.unit}`}</p>
      {presentExpiration && (
        <p className="ingredient-expiration">{ingredient.expirationDate}</p>
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
