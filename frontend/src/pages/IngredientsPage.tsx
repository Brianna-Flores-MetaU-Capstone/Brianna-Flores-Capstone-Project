import "../styles/IngredientsPage.css";
import AppHeader from "../components/AppHeader";
import { v4 as uuidv4 } from "uuid";
import { useState } from 'react'
import {ingredients} from "../utils/sampleData"
import Ingredient from "../components/Ingredient";
import IngredientModal from "../components/IngredientModal";
import type { IngredientData, RecipeToggleNavBarProps } from "../utils/types";
import Button from "@mui/material/Button";
import { INGREDIENT_MODAL } from "../utils/constants";

const IngredientsPage: React.FC<RecipeToggleNavBarProps> = ({ navOpen, toggleNav }) => {
  const [addIngredientModalOpen, setAddIngredientModalOpen] = useState(false)
  const [editIngredientData, setEditIngredientData] = useState<IngredientData>()
  const [editIngredientModalOpen, setEditIngredientModalOpen] = useState(false)

  const addIngredientClick = () => {
    setAddIngredientModalOpen((prev) => !prev)
  }

  const handleEditClick = (ingredient: IngredientData) => {
    setEditIngredientData(ingredient);
    setEditIngredientModalOpen((prev) => !prev)
  }

  return (
    <div className="ingredients-page">
      <AppHeader navOpen={navOpen} toggleNav={toggleNav}/>
      <section className="ingredient-page-container">
        <Button className="add-button" variant="outlined" onClick={addIngredientClick}>Add Ingredient</Button>
        <div className="ingredient-columns">
          <h3>Ingredient</h3>
          <h3>Quantity</h3>
          <h3>Expiration</h3>
          <div></div>
        </div>
        <div className="ingredients-page-list">
          {
            ingredients.map((ingredient) => {
                return (
                      <Ingredient key={uuidv4()} ingredient={ingredient} groceryCheck={false} presentExpiration={true} presentButtons={true} onEdit={handleEditClick}/>
                )
            })
          }
        </div>
      </section>
      {addIngredientModalOpen && <IngredientModal modalFor={INGREDIENT_MODAL} onClose={addIngredientClick} modalOpen={addIngredientModalOpen} />}
      {editIngredientModalOpen && <IngredientModal modalFor={INGREDIENT_MODAL} ingredientData={editIngredientData} onClose={() => setEditIngredientModalOpen((prev) => !prev)} modalOpen={editIngredientModalOpen}/>}
    </div>
  );
};

export default IngredientsPage;
