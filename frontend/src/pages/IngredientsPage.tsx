import "../styles/IngredientsPage.css";
import type { RecipeToggleNavBar } from "../utils/types";
import AppHeader from "../components/AppHeader";
import { v4 as uuidv4 } from "uuid";
import { useState } from 'react'
import {ingredients} from "../utils/sampleData"
import Ingredient from "../components/Ingredient";
import AddIngredientModal from "../components/AddIngredientModal";

const IngredientsPage = ({ navOpen, toggleNav }: RecipeToggleNavBar) => {
  const [addIngredientModalOpen, setAddIngredientModalOpen] = useState(false)

  const addIngredientClick = () => {
    setAddIngredientModalOpen((prev) => !prev)
  }

  return (
    <div className="ingredients-page">
      <AppHeader navOpen={navOpen} toggleNav={toggleNav}/>
      <section className="ingredient-page-container">
        <button className="add-ingredient-button" onClick={addIngredientClick}>Add Ingredient</button>
        <div className="ingredient-columns">
          <h3>Ingredient</h3>
          <h3>Quantity</h3>
          <h3>Expiration</h3>
        </div>
        <div className="ingredients-page-list">
          {
            ingredients.map((ingredient) => {
                return (
                      <Ingredient key={uuidv4()} ingredient={ingredient} extendedInfo={true}/>
                )
            })
          }
        </div>
      </section>
      {addIngredientModalOpen && <AddIngredientModal onClose={addIngredientClick} />}
    </div>
  );
};

export default IngredientsPage;
