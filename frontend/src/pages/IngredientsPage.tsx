import "../styles/IngredientsPage.css";
import type { navigationTypes } from "../utils/types";
import AppHeader from "../components/AppHeader";

import {ingredients} from "../utils/sampleData"
import Ingredient from "../components/Ingredient";
let count = 0;

const IngredientsPage = ({ navOpen, toggleNav }: navigationTypes) => {
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
                      <Ingredient key={count++} ingredient={ingredient} extendedInfo={true}/>
                )
            })
          }
        </div>
      </section>
    </div>
  );
};

export default IngredientsPage;
