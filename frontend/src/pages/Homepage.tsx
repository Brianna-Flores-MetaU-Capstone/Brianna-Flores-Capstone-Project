import "../styles/Homepage.css";
import type { GPToggleNavBarProps } from "../utils/types";
import { ingredients } from "../utils/sampleData";
import NextRecipe from "../components/NextRecipe";
import AppHeader from "../components/AppHeader";
import GenericList from "../components/GenericList";
import { PreviewConstants } from "../utils/constants";
import Ingredient from "../components/Ingredient";
import { v4 as uuidv4 } from "uuid";

const Homepage: React.FC<GPToggleNavBarProps> = ({ navOpen, toggleNav }) => {
  return (
    <div className="homepage-container">
      <AppHeader navOpen={navOpen} toggleNav={toggleNav} />
      <section className="quick-access-container">
        <NextRecipe />
        <div className="item-list">
          <GenericList
            className="list-items"
            headerList={[PreviewConstants.INGREDIENT]}
            list={ingredients}
            renderItem={(ingredient) => (
              <Ingredient
                key={uuidv4()}
                ingredient={ingredient}
                groceryCheck={false}
                presentExpiration={false}
                presentButtons={false}
              />
            )}
          />
        </div>
        <div className="item-list">
          <GenericList
            className="list-items"
            headerList={[PreviewConstants.GROCERY]}
            list={ingredients}
            renderItem={(item) => (
              <Ingredient
                key={uuidv4()}
                ingredient={item}
                groceryCheck={true}
                presentExpiration={false}
                presentButtons={false}
              />
            )}
          />
        </div>
      </section>
      <section className="upcoming-meals">
        <h3>Upcoming Meals</h3>
      </section>
    </div>
  );
};

export default Homepage;
