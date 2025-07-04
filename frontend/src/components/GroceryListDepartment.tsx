import React from "react";
import { groceryList } from "../utils/sampleData";
import type { GPIngredientDataTypes } from "../utils/types";
import GenericList from "./GenericList";

interface GPGroceryListDepartmentProps {
  department: string;
  handleOpenModal: (ingredient: GPIngredientDataTypes) => void;
}

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
          titles={[department]}
          list={filteredGroceries} 
          listConfig={() => ({
            groceryCheck: true,
            presentExpiration: false,
            presentButtons: true,
            onEdit: handleOpenModal
          })}/>
    </div>
  );
};

export default GroceryListDepartment;
