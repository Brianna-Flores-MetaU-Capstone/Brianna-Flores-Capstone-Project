import "../styles/IngredientsPage.css";
import AppHeader from "../components/AppHeader";
import { useState, useEffect } from "react";
import IngredientModal from "../components/IngredientModal";
import type {
  GPIngredientDataTypes,
  GPErrorMessageTypes,
} from "../utils/types";
import { Box, Button, Grid, Sheet } from "@mui/joy";
import { INGREDIENT_MODAL } from "../utils/constants";
import TitledListView from "../components/TitledListView";
import { v4 as uuidv4 } from "uuid";
import Ingredient from "../components/Ingredient";
import ErrorState from "../components/ErrorState";
import {
  fetchUserIngredientsHelper,
  deleteIngredient,
} from "../utils/databaseHelpers";
import { useUser } from "../contexts/UserContext";

const IngredientsPage = () => {
  const [addIngredientModalOpen, setAddIngredientModalOpen] = useState(false);
  const [editIngredientData, setEditIngredientData] =
    useState<GPIngredientDataTypes>();
  const [editIngredientModalOpen, setEditIngredientModalOpen] = useState(false);
  const [userIngredients, setUserIngredients] = useState<
    GPIngredientDataTypes[]
  >([]);
  const [message, setMessage] = useState<GPErrorMessageTypes>();
  const { user } = useUser();

  useEffect(() => {
    fetchUserIngredients();
  }, []);

  const addIngredientClick = () => {
    setAddIngredientModalOpen((prev) => !prev);
  };

  const handleEditClick = (ingredient: GPIngredientDataTypes) => {
    setEditIngredientData(ingredient);
    setEditIngredientModalOpen((prev) => !prev);
  };

  const fetchUserIngredients = async () => {
    const fetchedIngredients = await fetchUserIngredientsHelper({ setMessage });
    setUserIngredients(fetchedIngredients);
  };

  const handleDeleteIngredient = async (ingredient: GPIngredientDataTypes) => {
    if (!user) {
      setMessage({ error: true, message: "Error user not signed in" });
      return;
    }
    await deleteIngredient({ setMessage, ingredient });
    fetchUserIngredients();
  };

  return (
    <Sheet>
      <AppHeader />
      <Box sx={{m: 2}}>
        <Button onClick={addIngredientClick}>Add Ingredient</Button>
        <TitledListView
          headerList={[{title: "Ingredient", spacing: 4}, {title: "Quantity", spacing: 3}, {title: "Expiration", spacing: 5}]}
          list={userIngredients}
          renderItem={(ingredient) => (
            <Ingredient
              key={uuidv4()}
              ingredient={ingredient}
              presentGroceryCheck={false}
              presentExpiration={true}
              presentButtons={true}
              onEdit={handleEditClick}
              onDelete={() => handleDeleteIngredient(ingredient)}
            />
          )}
        />
        {message && (
          <ErrorState error={message.error} message={message.message} />
        )}
      </Box>
      {addIngredientModalOpen && (
        <IngredientModal
          modalFor={INGREDIENT_MODAL}
          isEditing={false}
          onClose={addIngredientClick}
          modalOpen={addIngredientModalOpen}
          fetchUserIngredients={fetchUserIngredients}
        />
      )}
      {editIngredientModalOpen && (
        <IngredientModal
          modalFor={INGREDIENT_MODAL}
          isEditing={true}
          ingredientData={editIngredientData}
          onClose={() => setEditIngredientModalOpen((prev) => !prev)}
          modalOpen={editIngredientModalOpen}
          fetchUserIngredients={fetchUserIngredients}
        />
      )}
    </Sheet>
  );
};

export default IngredientsPage;
