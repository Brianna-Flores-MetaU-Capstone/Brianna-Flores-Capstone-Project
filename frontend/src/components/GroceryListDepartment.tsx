import React from "react";
import type { GPIngredientDataTypes, GPRecipeIngredientTypes } from "../utils/types";
import GenericList from "./GenericList";
import Ingredient from "./Ingredient";
import { v4 as uuidv4 } from "uuid";

type GPGroceryListDepartmentProps = {
  groceryList: GPRecipeIngredientTypes[]
  department: string;
  handleOpenModal: (ingredient: GPIngredientDataTypes) => void;
};

const GroceryListDepartment: React.FC<GPGroceryListDepartmentProps> = ({
  groceryList,
  department,
  handleOpenModal,
}) => {
  const filteredGroceries = groceryList.filter(
    (item) => item.department === department
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
        renderItem={(ingredient) => (
          <Ingredient
            key={uuidv4()}
            ingredient={ingredient}
            groceryCheck={true}
            presentExpiration={false}
            presentButtons={true}
            onEdit={handleOpenModal}
            onDelete={handleDeleteIngredient}
          />
        )}
      />
    </div>
  );
};

export default GroceryListDepartment;
