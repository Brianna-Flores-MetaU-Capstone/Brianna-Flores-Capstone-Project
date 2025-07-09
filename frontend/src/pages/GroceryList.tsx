import "../styles/GroceryList.css";
import type {
  GPErrorMessageTypes,
  GPRecipeIngredientTypes,
  GPToggleNavBarProps,
} from "../utils/types";
import AppHeader from "../components/AppHeader";
import GroceryListDepartment from "../components/GroceryListDepartment";
import type { GPIngredientDataTypes } from "../utils/types";
import { useState, useEffect } from "react";
import IngredientModal from "../components/IngredientModal";
import SearchBar from "../components/SearchBar";
import Button from "@mui/material/Button";
import { GROCERY_MODAL } from "../utils/constants";
import GenericList from "../components/GenericList";
import ErrorState from "../components/ErrorState";

const databaseUrl = import.meta.env.VITE_DATABASE_URL;

const GroceryList: React.FC<GPToggleNavBarProps> = ({ navOpen, toggleNav }) => {
  const [editGroceryItemData, setEditGroceryItemData] =
    useState<GPIngredientDataTypes>();
  const [editGroceryItemModalOpen, setEditGroceryItemModalOpen] =
    useState(false);
  const [addGroceryItemModalOpen, setAddGroceryItemModalOpen] = useState(false);
  const [userGroceryList, setUserGroceryList] = useState<
    GPRecipeIngredientTypes[]
  >([]);
  const [groceryDepartments, setGroceryDepartments] = useState<string[]>([]);
  const [message, setMessage] = useState<GPErrorMessageTypes>();

  const handleAddGrocery = () => {
    setAddGroceryItemModalOpen((prev) => !prev);
  };

  const handleEditGrocery = (ingredient: GPIngredientDataTypes) => {
    setEditGroceryItemData(ingredient);
    setEditGroceryItemModalOpen((prev) => !prev);
  };

  useEffect(() => {
    fetchGroceryList();
  }, []);

  const fetchGroceryList = async () => {
    try {
      const response = await fetch(`${databaseUrl}/generateList`, {
        method: "GET",
        credentials: "include",
      });
      if (!response.ok) {
        setMessage({
          error: true,
          message: "Error failed to fetch user grocery list",
        });
      }
      const data = await response.json();
      setUserGroceryList(data);
      parseGroceryListDepartments(data);
    } catch (error) {
      setMessage({
        error: true,
        message: "Error failed to fetch user grocery list",
      });
      return [];
    }
  };

  const parseGroceryListDepartments = (
    groceryList: GPRecipeIngredientTypes[]
  ) => {
    let departments: string[] = [];
    for (const grocery of groceryList) {
      if (!departments.includes(grocery.department)) {
        departments = [...departments, grocery.department];
      }
    }
    setGroceryDepartments(departments);
    return departments;
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
          list={groceryDepartments}
          renderItem={(department) => (
            <GroceryListDepartment
              key={department}
              groceryList={userGroceryList}
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
          isEditing={false}
          onClose={handleAddGrocery}
          modalOpen={addGroceryItemModalOpen}
          fetchUserIngredients={fetchGroceryList}
        />
      )}
      {editGroceryItemModalOpen && (
        <IngredientModal
          modalFor={GROCERY_MODAL}
          isEditing={true}
          ingredientData={editGroceryItemData}
          onClose={() => setEditGroceryItemModalOpen((prev) => !prev)}
          modalOpen={editGroceryItemModalOpen}
          fetchUserIngredients={fetchGroceryList}
        />
      )}
      {message && (
          <ErrorState error={message.error} message={message.message} />
        )}
    </div>
  );
};

export default GroceryList;
