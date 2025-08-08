import React from "react";
import TitledListView from "./utils/TitledListView";
import Ingredient from "./ingredients/Ingredient";
import { Box } from "@mui/joy";
import {
  ColumnOverflowTitledListStyle,
  MUI_GRID_FULL_SPACE,
} from "../utils/style/UIStyle";
import type { IngredientData } from "../../../shared/IngredientData";

const GPGroceryListDepartmentStyle = {
  p: 2,
  width: 500,
  borderRadius: "md",
  border: "2px solid",
  borderColor: "primary.300",
};

type GPGroceryListDepartmentProps = {
  groceryList: IngredientData[];
  department: string;
  onGroceryCheck: (ingredientName: string) => void;
  onGroceryDelete: (ingredientName: string) => void;
};
const GroceryListDepartment: React.FC<GPGroceryListDepartmentProps> = ({
  groceryList,
  department,
  onGroceryCheck,
  onGroceryDelete,
}) => {
  const filteredGroceries = groceryList.filter(
    (item) => item.department === department,
  );

  return (
    <Box sx={GPGroceryListDepartmentStyle}>
      <TitledListView
        headerList={[{ title: department, spacing: MUI_GRID_FULL_SPACE }]}
        itemsList={filteredGroceries}
        renderItem={(itemInfo, index) => (
          <Ingredient
            key={index}
            ingredient={itemInfo}
            presentGroceryCheck={true}
            presentExpiration={false}
            presentButtons={false}
            onGroceryCheck={onGroceryCheck}
            onGroceryDelete={onGroceryDelete}
          />
        )}
        listItemsStyle={ColumnOverflowTitledListStyle}
      />
    </Box>
  );
};

export default GroceryListDepartment;
