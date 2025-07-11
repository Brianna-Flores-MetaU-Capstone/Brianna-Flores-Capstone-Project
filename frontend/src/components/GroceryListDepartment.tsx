import React from "react";
import type {
  GPIngredientDataTypes,
  GPRecipeIngredientTypes,
  GPIngredientWithCostInfoTypes
} from "../utils/types";
import GenericList from "./GenericList";
import Ingredient from "./Ingredient";
import { v4 as uuidv4 } from "uuid";

type GPGroceryListDepartmentProps = {
  groceryList: GPIngredientWithCostInfoTypes[];
  department: string;
};
const GroceryListDepartment: React.FC<GPGroceryListDepartmentProps> = ({
  groceryList,
  department,
}) => {
  const filteredGroceries = groceryList.filter(
    (item) => item.ingredient.department === department
  );

  const handleDeleteIngredient = async (
    ingredient: GPIngredientDataTypes
  ) => {};

  return (
    <div className="grocery-department">
      <GenericList
        className="grocery-department-items"
        headerList={[department]}
        list={filteredGroceries}
        renderItem={(itemInfo) => (
          <Ingredient
            key={uuidv4()}
            ingredient={itemInfo.ingredient}
            presentGroceryCheck={true}
            presentExpiration={false}
            presentButtons={false}
            ingredientCost={itemInfo.ingredientApiInfo}
            onDelete={handleDeleteIngredient}
          />
        )}
      />
    </div>
  );
};

export default GroceryListDepartment;
