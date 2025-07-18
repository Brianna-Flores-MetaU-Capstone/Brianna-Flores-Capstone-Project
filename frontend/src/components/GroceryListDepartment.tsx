import React from "react";
import type {
  GPIngredientDataTypes,
} from "../utils/types";
import TitledListView from "./TitledListView";
import Ingredient from "./Ingredient";
import { Box } from "@mui/joy";
import { MUI_GRID_FULL_SPACE } from "../utils/UIStyle";

type GPGroceryListDepartmentProps = {
  groceryList: GPIngredientDataTypes[];
  department: string;
  onGroceryCheck: (ingredientName: string) => void;
};
const GroceryListDepartment: React.FC<GPGroceryListDepartmentProps> = ({
  groceryList,
  department,
  onGroceryCheck,
}) => {
  const filteredGroceries = groceryList.filter(
    (item) => item.department === department
  );

  const handleDeleteIngredient = async (
    ingredient: GPIngredientDataTypes
  ) => {};

  return (
    <Box sx={{p: 2, width: 500, borderRadius: "md", border: "2px solid", borderColor: "primary.300"}}>
      <TitledListView
        headerList={[{title: department, spacing: MUI_GRID_FULL_SPACE}]}
        itemsList={filteredGroceries}
        renderItem={(itemInfo, index) => (
          <Ingredient
            key={index}
            ingredient={itemInfo}
            presentGroceryCheck={true}
            presentExpiration={false}
            presentButtons={false}
            ingredientCost={{ingredientCost: itemInfo.ingredientCost, ingredientAmount: itemInfo.ingredientAmount}}
            onGroceryCheck={onGroceryCheck}
            onDelete={handleDeleteIngredient}
          />
        )}
      />
    </Box>
  );
};

export default GroceryListDepartment;
