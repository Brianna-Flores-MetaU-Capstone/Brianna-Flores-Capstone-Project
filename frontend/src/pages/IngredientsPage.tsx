import "../styles/IngredientsPage.css";
import AppHeader from "../components/AppHeader";
import { useState, useEffect } from "react";
import IngredientModal from "../components/IngredientModal";
import type {
  GPIngredientDataTypes,
  GPToggleNavBarProps,
  GPErrorMessageTypes,
  GPIngredientsOnHandTypes,
} from "../utils/types";
import Button from "@mui/material/Button";
import { INGREDIENT_MODAL } from "../utils/constants";
import GenericList from "../components/GenericList";
import { v4 as uuidv4 } from "uuid";
import Ingredient from "../components/Ingredient";
import ErrorState from "../components/ErrorState";

const IngredientsPage: React.FC<GPToggleNavBarProps> = ({
  navOpen,
  toggleNav,
}) => {
  const [addIngredientModalOpen, setAddIngredientModalOpen] = useState(false);
  const [editIngredientData, setEditIngredientData] =
    useState<GPIngredientDataTypes>();
  const [editIngredientModalOpen, setEditIngredientModalOpen] = useState(false);
  const [userIngredients, setUserIngredients] = useState<
    GPIngredientsOnHandTypes[]
  >([]);
  const [message, setMessage] = useState<GPErrorMessageTypes>();

  // on mount, fetch ingredients
  useEffect(() => {
    const fetchUserIngredients = async () => {
      try {
        const response = await fetch("http://localhost:3000/ingredients", {
          method: "GET",
          credentials: "include",
        });
        if (!response.ok) {
          setMessage({
            error: true,
            message: "Error displaying user ingredients",
          });
          return;
        }
        const data = await response.json();
        setUserIngredients(data);
      } catch (error) {
        setMessage({
          error: true,
          message: "Error displaying user ingredients",
        });
      }
    };
    fetchUserIngredients();
  }, []);

  const addIngredientClick = () => {
    setAddIngredientModalOpen((prev) => !prev);
  };

  const handleEditClick = (ingredient: GPIngredientDataTypes) => {
    setEditIngredientData(ingredient);
    setEditIngredientModalOpen((prev) => !prev);
  };

  const handleNewIngredient = (newIngredient: GPIngredientsOnHandTypes) => {
    setUserIngredients((prev) => [...prev, newIngredient]);
  };

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
          renderItem={(link) => (
            <Ingredient
              key={uuidv4()}
              ingredient={link.ingredient}
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
          onClose={addIngredientClick}
          modalOpen={addIngredientModalOpen}
          handleNewIngredient={handleNewIngredient}
        />
      )}
      {editIngredientModalOpen && (
        <IngredientModal
          modalFor={INGREDIENT_MODAL}
          ingredientData={editIngredientData}
          onClose={() => setEditIngredientModalOpen((prev) => !prev)}
          modalOpen={editIngredientModalOpen}
          handleNewIngredient={handleNewIngredient}
        />
      )}
    </div>
  );
};

export default IngredientsPage;
