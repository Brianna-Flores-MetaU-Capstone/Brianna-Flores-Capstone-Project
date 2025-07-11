import "../styles/GroceryList.css";
import type {
  GPErrorMessageTypes,
  GPToggleNavBarProps,
  GPIngredientWithCostInfoTypes,
} from "../utils/types";
import AppHeader from "../components/AppHeader";
import GroceryListDepartment from "../components/GroceryListDepartment";
import { useState, useEffect } from "react";
import IngredientModal from "../components/IngredientModal";
import Button from "@mui/material/Button";
import { GROCERY_MODAL } from "../utils/constants";
import GenericList from "../components/GenericList";
import ErrorState from "../components/ErrorState";
import { fetchGroceryList } from "../utils/databaseHelpers";

const GroceryList: React.FC<GPToggleNavBarProps> = ({ navOpen, toggleNav }) => {
  const [addGroceryItemModalOpen, setAddGroceryItemModalOpen] = useState(false);
  const [userGroceryList, setUserGroceryList] = useState<
    GPIngredientWithCostInfoTypes[]
  >([]);
  const [groceryDepartments, setGroceryDepartments] = useState<string[]>([]);
  const [groceryListCost, setGroceryListCost] = useState(0.0);
  const [message, setMessage] = useState<GPErrorMessageTypes>();

  const handleAddGrocery = () => {
    setAddGroceryItemModalOpen((prev) => !prev);
  };

  useEffect(() => {
    fetchGroceryList({
      setMessage,
      setUserGroceryList,
      setGroceryDepartments,
      setGroceryListCost,
    });
  }, []);
  return (
    <div>
      <AppHeader navOpen={navOpen} toggleNav={toggleNav} />
      <div className="grocery-list-container">
        <Button className="add-button" onClick={handleAddGrocery}>
          Add Item
        </Button>
        <Button className="add-button" onClick={handleAddGrocery}>
          Clear Purchased Items
        </Button>

        <GenericList
          className="grocery-departments"
          list={groceryDepartments}
          renderItem={(department) => (
            <GroceryListDepartment
              key={department}
              groceryList={userGroceryList}
              department={department}
            />
          )}
        />
        <h3>Estimated Cost</h3>
        <h3>${Number(groceryListCost).toFixed(2)}</h3>
      </div>
      {addGroceryItemModalOpen && (
        <IngredientModal
          modalFor={GROCERY_MODAL}
          isEditing={false}
          onClose={handleAddGrocery}
          modalOpen={addGroceryItemModalOpen}
          fetchUserIngredients={() =>
            fetchGroceryList({
              setMessage,
              setUserGroceryList,
              setGroceryDepartments,
              setGroceryListCost,
            })
          }
        />
      )}
      {message && (
        <ErrorState error={message.error} message={message.message} />
      )}
    </div>
  );
};

export default GroceryList;
