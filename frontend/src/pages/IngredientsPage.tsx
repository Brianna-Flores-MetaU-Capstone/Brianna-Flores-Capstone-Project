import "../styles/IngredientsPage.css";
import AppHeader from "../components/AppHeader";
import { useState } from "react";
import { ingredients } from "../utils/sampleData";
import IngredientModal from "../components/IngredientModal";
import type {
  GPIngredientDataTypes,
  GPToggleNavBarProps,
} from "../utils/types";
import Button from "@mui/material/Button";
import { INGREDIENT_MODAL } from "../utils/constants";
import GenericList from "../components/GenericList";

const IngredientsPage: React.FC<GPToggleNavBarProps> = ({
  navOpen,
  toggleNav,
}) => {
  const [addIngredientModalOpen, setAddIngredientModalOpen] = useState(false);
  const [editIngredientData, setEditIngredientData] =
    useState<GPIngredientDataTypes>();
  const [editIngredientModalOpen, setEditIngredientModalOpen] = useState(false);

  const addIngredientClick = () => {
    setAddIngredientModalOpen((prev) => !prev);
  };

  const handleEditClick = (ingredient: GPIngredientDataTypes) => {
    setEditIngredientData(ingredient);
    setEditIngredientModalOpen((prev) => !prev);
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
          titles={["Ingredient", "Quantity", 'Expiration']}
          list={ingredients} 
          listConfig={() => ({
            groceryCheck: false,
            presentExpiration: true,
            presentButtons: true,
            onEdit: handleEditClick
          })}/>
      </section>
      {addIngredientModalOpen && (
        <IngredientModal
          modalFor={INGREDIENT_MODAL}
          onClose={addIngredientClick}
          modalOpen={addIngredientModalOpen}
        />
      )}
      {editIngredientModalOpen && (
        <IngredientModal
          modalFor={INGREDIENT_MODAL}
          ingredientData={editIngredientData}
          onClose={() => setEditIngredientModalOpen((prev) => !prev)}
          modalOpen={editIngredientModalOpen}
        />
      )}
    </div>
  );
};

export default IngredientsPage;
