import "../styles/Homepage.css";
import type {
  GPErrorMessageTypes,
  GPIngredientDataTypes,
  GPToggleNavBarProps,
  GPIngredientWithCostInfoTypes,
} from "../utils/types";
import NextRecipe from "../components/NextRecipe";
import AppHeader from "../components/AppHeader";
import TitledListView from "../components/TitledListView";
import { PreviewConstants } from "../utils/constants";
import Ingredient from "../components/Ingredient";
import { v4 as uuidv4 } from "uuid";
import {
  fetchGroceryList,
  fetchUserIngredientsHelper,
} from "../utils/databaseHelpers";
import { useState, useEffect } from "react";
import { useUser } from "../contexts/UserContext";

const Homepage: React.FC<GPToggleNavBarProps> = ({ navOpen, toggleNav }) => {
  const [message, setMessage] = useState<GPErrorMessageTypes>();
  const [userGroceryList, setUserGroceryList] = useState<
    GPIngredientWithCostInfoTypes[]
  >([]);
  const [userIngredientList, setUserIngredientList] = useState<
    GPIngredientDataTypes[]
  >([]);
  const { user } = useUser();

  useEffect(() => {
    const setUserListPreviews = async () => {
      if (user) {
        fetchGroceryList({ setMessage, setUserGroceryList });
        const userIngredients = await fetchUserIngredientsHelper({
          setMessage,
        });
        setUserIngredientList(userIngredients);
      }
    };
    setUserListPreviews();
  }, []);
  return (
    <div className="homepage-container">
      <AppHeader navOpen={navOpen} toggleNav={toggleNav} />
      <section className="quick-access-container">
        <NextRecipe />
        <div className="item-list">
          <TitledListView
            className="list-items"
            headerList={[PreviewConstants.INGREDIENT]}
            list={userIngredientList}
            renderItem={(ingredient) => (
              <Ingredient
                key={uuidv4()}
                ingredient={ingredient}
                presentGroceryCheck={false}
                presentExpiration={false}
                presentButtons={false}
              />
            )}
          />
        </div>
        <div className="item-list">
          <TitledListView
            className="list-items"
            headerList={[PreviewConstants.GROCERY]}
            list={userGroceryList}
            renderItem={(item) => (
              <Ingredient
                key={uuidv4()}
                ingredient={item?.ingredient}
                presentGroceryCheck={true}
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
