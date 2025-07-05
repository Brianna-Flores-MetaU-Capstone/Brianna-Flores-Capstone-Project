import React from "react";
import { groceryList } from "../utils/sampleData";
import type { GPIngredientDataTypes } from "../utils/types";
import GenericList from "./GenericList";
import Ingredient from "./Ingredient";
import { v4 as uuidv4 } from "uuid";

type GPGroceryListDepartmentProps = {
  department: string;
  handleOpenModal: (ingredient: GPIngredientDataTypes) => void;
};

const GroceryListDepartment: React.FC<GPGroceryListDepartmentProps> = ({
  department,
  handleOpenModal,
}) => {
  const filteredGroceries = groceryList.filter(
    (item) => item.department === department
  );

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
          />
        )}
      />
    </div>
  );
};

export default GroceryListDepartment;
