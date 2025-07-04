import "../styles/Homepage.css";
import type { GPToggleNavBarProps } from "../utils/types";
import { groceryList, ingredients } from "../utils/sampleData";
import NextRecipe from "../components/NextRecipe";
import IngredientsPreview from "../components/IngredientsPreview";
import GroceryPreview from "../components/GroceryPreview";
import AppHeader from "../components/AppHeader";

const Homepage: React.FC<GPToggleNavBarProps> = ({ navOpen, toggleNav }) => {
  return (
    <div className="homepage-container">
      <AppHeader navOpen={navOpen} toggleNav={toggleNav} />
      <section className="quick-access-container">
        <NextRecipe />
        <IngredientsPreview ingredientsList={ingredients} />
        <GroceryPreview groceryList={groceryList} />
      </section>
      <section className="upcoming-meals">
        <h3>Upcoming Meals</h3>
      </section>
    </div>
  );
};

export default Homepage;
