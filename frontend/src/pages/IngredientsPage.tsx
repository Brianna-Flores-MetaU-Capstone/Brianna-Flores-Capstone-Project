import "../styles/IngredientsPage.css";
import type { RecipeToggleNavBar } from "../utils/types";
import AppHeader from "../components/AppHeader";
import { v4 as uuidv4 } from "uuid";
import { useState } from 'react'
import {ingredients} from "../utils/sampleData"
import Ingredient from "../components/Ingredient";
import IngredientModal from "../components/IngredientModal";
import type { RecipeIngredientData } from "../utils/types";

const IngredientsPage = ({ navOpen, toggleNav }: RecipeToggleNavBar) => {
  const [addIngredientModalOpen, setAddIngredientModalOpen] = useState(false)
  const [editIngredientData, setEditIngredientData] = useState<RecipeIngredientData>()
  const [editIngredientModalOpen, setEditIngredientModalOpen] = useState(false)

  const addIngredientClick = () => {
    setAddIngredientModalOpen((prev) => !prev)
  }

  const handleEditClick = (ingredient: RecipeIngredientData) => {
    setEditIngredientData(ingredient);
    setEditIngredientModalOpen((prev) => !prev)
  }

  return (
    <div className="ingredients-page">
      <AppHeader navOpen={navOpen} toggleNav={toggleNav}/>
      <section className="ingredient-page-container">
        <button className="add-button" onClick={addIngredientClick}>Add Ingredient</button>
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
      {addIngredientModalOpen && <IngredientModal modalFor="ingredients-page" onClose={addIngredientClick} />}
      {editIngredientModalOpen && <IngredientModal modalFor="ingredients-page" ingredientData={editIngredientData} onClose={() => setEditIngredientModalOpen((prev) => !prev)} />}

    </div>
  );
};

export default IngredientsPage;
