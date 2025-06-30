import "../styles/IngredientsPage.css";
import type { RecipeToggleNavBar } from "../utils/types";
import AppHeader from "../components/AppHeader";

import {ingredients} from "../utils/sampleData"
import Ingredient from "../components/Ingredient";
import AddIngredientModal from "../components/AddIngredientModal";
import { v4 as uuidv4 } from "uuid";

const IngredientsPage = ({ navOpen, toggleNav }: RecipeToggleNavBar) => {
  return (
    <div className="ingredients-page">
      <AppHeader navOpen={navOpen} toggleNav={toggleNav}/>
      <section className="ingredient-page-container">
        <button className="add-ingredient-button">Add Ingredient</button>
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
      <AddIngredientModal />
    </div>
  );
};

export default IngredientsPage;
