import React from "react";
import type { GPIngredientPriceInfoTypes } from "../../../backend/utils/utils";

type GPIngredientPriceTypes = {
  ingredientPriceInfo: GPIngredientPriceInfoTypes;
};

const IngredientPrice = ({ ingredientPriceInfo }: GPIngredientPriceTypes) => {
  return (
    <div>
      <div className="list-ingredient">
        <p>{ingredientPriceInfo.ingredient.ingredientName}</p>
        <p>
          ${ingredientPriceInfo.ingredientApiInfo.ingredientPrice.toFixed(2)}
        </p>
        <p>{ingredientPriceInfo.ingredientApiInfo.ingredientAmount}</p>
      </div>
    </div>
  );
};

export default IngredientPrice;
