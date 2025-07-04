import React from "react";
import Ingredient from "./Ingredient";
import "../styles/Homepage.css";
import type { GPIngredientDataTypes } from "../utils/types";
import { v4 as uuidv4 } from "uuid";

interface GPHomepageIngredientPreviewProps {
  ingredientsList: GPIngredientDataTypes[];
}

const IngredientsPreview: React.FC<GPHomepageIngredientPreviewProps> = ({
  ingredientsList,
}) => {
  return (
    <div className="ingredient-preview">
      <h3>Ingredients on Hand</h3>
      <div className="list-items">
        {ingredientsList.map((ingredient) => {
          return (
            <Ingredient
              key={uuidv4()}
              ingredient={ingredient}
              groceryCheck={false}
              presentExpiration={false}
              presentButtons={false}
            />
          );
        })}
      </div>
    </div>
  );
};

export default IngredientsPreview;
