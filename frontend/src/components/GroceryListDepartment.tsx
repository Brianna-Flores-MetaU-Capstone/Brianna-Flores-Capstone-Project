import React from "react";
import type {
  GPIngredientDataTypes,
  GPIngredientWithCostInfoTypes,
} from "../utils/types";
import TitledListView from "./TitledListView";
import Ingredient from "./Ingredient";
import { v4 as uuidv4 } from "uuid";

type GPGroceryListDepartmentProps = {
  groceryList: GPIngredientWithCostInfoTypes[];
  department: string;
  onGroceryCheck: (ingredientName: string) => void;
};
const GroceryListDepartment: React.FC<GPGroceryListDepartmentProps> = ({
  groceryList,
  department,
  onGroceryCheck,
}) => {
  const filteredGroceries = groceryList.filter(
    (item) => item.ingredient.department === department
  );

  const handleDeleteIngredient = async (
    ingredient: GPIngredientDataTypes
  ) => {};

  return (
    <div className="grocery-department">
      <TitledListView
        headerList={[{title: department, spacing: 1}]}
        list={filteredGroceries}
        renderItem={(itemInfo) => (
          <Ingredient
            key={uuidv4()}
            ingredient={itemInfo.ingredient}
            presentGroceryCheck={true}
            presentExpiration={false}
            presentButtons={false}
            ingredientCost={itemInfo.ingredientApiInfo}
            onGroceryCheck={onGroceryCheck}
            onDelete={handleDeleteIngredient}
          />
        )}
      />
    </div>
  );
};

export default GroceryListDepartment;
