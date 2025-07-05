import "../styles/GroceryList.css";
import type { GPToggleNavBarProps } from "../utils/types";
import AppHeader from "../components/AppHeader";
import GroceryListDepartment from "../components/GroceryListDepartment";
import type { GPIngredientDataTypes } from "../utils/types";
import { useState } from "react";
import IngredientModal from "../components/IngredientModal";
import { departments } from "../utils/sampleData";
import SearchBar from "../components/SearchBar";
import Button from "@mui/material/Button";
import { GROCERY_MODAL } from "../utils/constants";
import GenericList from "../components/GenericList";

const GroceryList: React.FC<GPToggleNavBarProps> = ({ navOpen, toggleNav }) => {
  const [editGroceryItemData, setEditGroceryItemData] =
    useState<GPIngredientDataTypes>();
  const [editGroceryItemModalOpen, setEditGroceryItemModalOpen] =
    useState(false);
  const [addGroceryItemModalOpen, setAddGroceryItemModalOpen] = useState(false);

  const handleAddGrocery = () => {
    setAddGroceryItemModalOpen((prev) => !prev);
  };

  const handleEditGrocery = (ingredient: GPIngredientDataTypes) => {
    setEditGroceryItemData(ingredient);
    setEditGroceryItemModalOpen((prev) => !prev);
  };

  return (
    <div>
      <AppHeader navOpen={navOpen} toggleNav={toggleNav} />
      <div className="grocery-list-container">
        <SearchBar />
        <Button className="add-button" onClick={handleAddGrocery}>
          Add Item
        </Button>
        <Button className="add-button" onClick={handleAddGrocery}>
          Clear Purchased Items
        </Button>

        <GenericList
          className="grocery-departments"
          list={departments}
          renderItem={(department) => (
            <GroceryListDepartment
              key={department}
              department={department}
              handleOpenModal={handleEditGrocery}
            />
          )}
        />
        <h3>Estimated Cost</h3>
        <h3>$x.xx</h3>
      </div>
      {addGroceryItemModalOpen && (
        <IngredientModal
          modalFor={GROCERY_MODAL}
          onClose={handleAddGrocery}
          modalOpen={addGroceryItemModalOpen}
        />
      )}
      {editGroceryItemModalOpen && (
        <IngredientModal
          modalFor={GROCERY_MODAL}
          ingredientData={editGroceryItemData}
          onClose={() => setEditGroceryItemModalOpen((prev) => !prev)}
          modalOpen={editGroceryItemModalOpen}
        />
      )}
    </div>
  );
};

export default GroceryList;
