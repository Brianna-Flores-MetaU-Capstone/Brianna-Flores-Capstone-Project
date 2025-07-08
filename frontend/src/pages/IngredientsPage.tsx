import "../styles/IngredientsPage.css";
import AppHeader from "../components/AppHeader";
import { useState, useEffect } from "react";
import IngredientModal from "../components/IngredientModal";
import type {
  GPIngredientDataTypes,
  GPToggleNavBarProps,
  GPErrorMessageTypes,
} from "../utils/types";
import Button from "@mui/material/Button";
import { INGREDIENT_MODAL } from "../utils/constants";
import GenericList from "../components/GenericList";
import { v4 as uuidv4 } from "uuid";
import Ingredient from "../components/Ingredient";
import ErrorState from "../components/ErrorState";
import { fetchUserIngredientsHelper } from "../utils/databaseHelpers";

const IngredientsPage: React.FC<GPToggleNavBarProps> = ({
  navOpen,
  toggleNav,
}) => {
  const [addIngredientModalOpen, setAddIngredientModalOpen] = useState(false);
  const [editIngredientData, setEditIngredientData] =
    useState<GPIngredientDataTypes>();
  const [editIngredientModalOpen, setEditIngredientModalOpen] = useState(false);
  const [userIngredients, setUserIngredients] = useState<
    GPIngredientDataTypes[]
  >([]);
  const [message, setMessage] = useState<GPErrorMessageTypes>();

  // on mount, fetch ingredients
  useEffect(() => {
    fetchUserIngredients()
  }, []);

  const addIngredientClick = () => {
    setAddIngredientModalOpen((prev) => !prev);
  };

  const handleEditClick = (ingredient: GPIngredientDataTypes) => {
    setEditIngredientData(ingredient);
    setEditIngredientModalOpen((prev) => !prev);
  };

  const fetchUserIngredients = async () => {
    const fetchedIngredients = await fetchUserIngredientsHelper({setMessage})
    setUserIngredients(fetchedIngredients)
  }

  return (
    <div className="ingredients-page">
      <AppHeader navOpen={navOpen} toggleNav={toggleNav} />
      <section className="ingredient-page-container">
        <Button
          className="add-button"
          variant="outlined"
          onClick={addIngredientClick}
        >
          Add Ingredient
        </Button>
        <GenericList
          className="list-items"
          headerList={["Ingredient", "Quantity", "Expiration"]}
          list={userIngredients}
          renderItem={(ingredient) => (
            <Ingredient
              key={uuidv4()}
              ingredient={ingredient}
              groceryCheck={false}
              presentExpiration={true}
              presentButtons={true}
              onEdit={handleEditClick}
            />
          )}
        />
        {message && (
          <ErrorState error={message.error} message={message.message} />
        )}
      </section>
      {addIngredientModalOpen && (
        <IngredientModal
          modalFor={INGREDIENT_MODAL}
          isEditing={false}
          onClose={addIngredientClick}
          modalOpen={addIngredientModalOpen}
          updateUserIngredients={fetchUserIngredients}
        />
      )}
      {editIngredientModalOpen && (
        <IngredientModal
          modalFor={INGREDIENT_MODAL}
          isEditing={true}
          ingredientData={editIngredientData}
          onClose={() => setEditIngredientModalOpen((prev) => !prev)}
          modalOpen={editIngredientModalOpen}
          updateUserIngredients={fetchUserIngredients}
        />
      )}
    </div>
  );
};

export default IngredientsPage;
