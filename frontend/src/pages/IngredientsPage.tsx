import AppHeader from "../components/utils/AppHeader";
import { useState, useEffect } from "react";
import IngredientModal from "../components/ingredients/IngredientModal";
import type {
  GPIngredientDataTypes,
  GPErrorMessageTypes,
} from "../utils/types/types";
import { Box, Button, Sheet } from "@mui/joy";
import { INGREDIENT_MODAL } from "../utils/constants";
import TitledListView from "../components/utils/TitledListView";
import Ingredient from "../components/ingredients/Ingredient";
import ErrorState from "../components/utils/ErrorState";
import {
  fetchUserIngredientsHelper,
  deleteIngredient,
} from "../utils/databaseHelpers";
import { useUser } from "../contexts/UserContext";
import { ColumnNoOverflowTitledListStyle } from "../utils/style/UIStyle";

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
    const fetchedIngredients =
      (await fetchUserIngredientsHelper({ setMessage })) ?? [];
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
      <Box sx={{ m: 2 }}>
        <Button onClick={addIngredientClick} sx={{ mb: 2 }}>
          Add Ingredient
        </Button>
        {message && (
          <ErrorState error={message.error} message={message.message} />
        )}
        <TitledListView
          headerList={[
            { title: "Ingredient", spacing: 4 },
            { title: "Quantity", spacing: 3 },
            { title: "Expiration", spacing: 3 },
          ]}
          itemsList={userIngredients}
          renderItem={(ingredient, index) => (
            <Ingredient
              key={index}
              ingredient={ingredient}
              presentGroceryCheck={false}
              presentExpiration={true}
              presentButtons={true}
              onEdit={handleEditClick}
              onDelete={() => handleDeleteIngredient(ingredient)}
            />
          )}
          listItemsStyle={ColumnNoOverflowTitledListStyle}
        />
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
