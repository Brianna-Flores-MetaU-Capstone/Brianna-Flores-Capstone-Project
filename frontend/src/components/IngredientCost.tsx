import React from "react";
import type { GPIngredientCostInfoTypes } from "../../../backend/utils/utils";

type GPIngredientCostTypes = {
  ingredientCostInfo: GPIngredientCostInfoTypes;
};

const IngredientCost = ({ ingredientCostInfo }: GPIngredientCostTypes) => {
  return (
    <div>
      <div className="list-ingredient">
        <p>{ingredientCostInfo.ingredient.ingredientName}</p>
        <p>
          ${ingredientCostInfo.ingredientApiInfo.ingredientCost?.toFixed(2)}
        </p>
        <p>{ingredientCostInfo.ingredientApiInfo.ingredientAmount}</p>
      </div>
    </div>
  );
};

export default IngredientCost;
