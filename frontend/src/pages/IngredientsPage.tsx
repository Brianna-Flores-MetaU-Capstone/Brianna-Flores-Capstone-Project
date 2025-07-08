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
import { fetchUserIngredients } from "../utils/databaseHelpers";

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
    fetchUserIngredients({setMessage}).then((fetchedIngredients) =>
    setUserIngredients(fetchedIngredients))
  }, []);

  const addIngredientClick = () => {
    setAddIngredientModalOpen((prev) => !prev);
  };

  const handleEditClick = (ingredient: GPIngredientDataTypes) => {
    setEditIngredientData(ingredient);
    setEditIngredientModalOpen((prev) => !prev);
  };

  const handleNewIngredient = async (newIngredient: GPIngredientDataTypes) => {
    setUserIngredients((prev) => [...prev, newIngredient]);
  };
  
  const handleUpdateIngredient = (updatedIngredient: GPIngredientDataTypes) => {
    setUserIngredients((prev) => 
      prev.map((ingredient) => 
        ingredient.id === updatedIngredient.id ? updatedIngredient: ingredient
      )
    )
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
          handleNewIngredient={handleNewIngredient}
          handleUpdateIngredient={handleUpdateIngredient}
        />
      )}
      {editIngredientModalOpen && (
        <IngredientModal
          modalFor={INGREDIENT_MODAL}
          isEditing={true}
          ingredientData={editIngredientData}
          onClose={() => setEditIngredientModalOpen((prev) => !prev)}
          modalOpen={editIngredientModalOpen}
          handleNewIngredient={handleNewIngredient}
          handleUpdateIngredient={handleUpdateIngredient}
        />
      )}
    </div>
  );
};

export default IngredientsPage;
