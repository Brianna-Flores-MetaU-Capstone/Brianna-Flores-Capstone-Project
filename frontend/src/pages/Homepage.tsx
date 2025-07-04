import "../styles/Homepage.css";
import type { GPToggleNavBarProps } from "../utils/types";
import { groceryList, ingredients } from "../utils/sampleData";
import NextRecipe from "../components/NextRecipe";
import AppHeader from "../components/AppHeader";
import GenericList from "../components/GenericList";
import { preview } from "../utils/constants";

const Homepage: React.FC<GPToggleNavBarProps> = ({ navOpen, toggleNav }) => {
  return (
    <div className="homepage-container">
      <AppHeader navOpen={navOpen} toggleNav={toggleNav} />
      <section className="quick-access-container">
        <NextRecipe />
        <GenericList titles={[preview.INGREDIENT]} list={ingredients} listConfig={() => ({
          groceryCheck: false,
          presentExpiration: false,
          presentButtons: false
        })}/>
        <GenericList titles={[preview.GROCERY]} list={ingredients} listConfig={() => ({
          groceryCheck: true,
          presentExpiration: false,
          presentButtons: false
        })}/>
      </section>
      <section className="upcoming-meals">
        <h3>Upcoming Meals</h3>
      </section>
    </div>
  );
};

export default Homepage;
