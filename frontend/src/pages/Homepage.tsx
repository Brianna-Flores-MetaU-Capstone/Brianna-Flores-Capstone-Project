import "../styles/Homepage.css";
import type { navigationTypes } from "../utils/types";
import { useNavigate } from "react-router";

import { auth } from "../utils/firebase";

import { groceryList, ingredients } from "../utils/sampleData";

import NextRecipe from "../components/NextRecipe";
import IngredientsPreview from "../components/IngredientsPreview";
import GroceryPreview from "../components/GroceryPreview";
import AppHeader from "../components/AppHeader";

const Homepage = ({ navOpen, toggleNav }: navigationTypes) => {
  const user = auth.currentUser;
  const navigate = useNavigate();

  if (user) {
    // User is signed in, see docs for a list of available properties
    // https://firebase.google.com/docs/reference/js/auth.user
    // ...
    console.log("user is signed in: ", user);
  } else {
    // No user is signed in.
    console.log("no user signed in");
  }

  const handleLoginClick = () => {
    if (navOpen) {
      toggleNav();
    }
    navigate("/login");
  };

  return (
    <div className="homepage-container">
      <AppHeader navOpen={navOpen} toggleNav={toggleNav} />
      <button className="login-button" onClick={handleLoginClick}>
        Login
      </button>
      <section className="quick-access-container">
        <NextRecipe />
        <IngredientsPreview ingredientsList={ingredients}/>
        <GroceryPreview groceryList={groceryList} />
      </section>
      <section className="upcoming-meals">
        <h3>Upcoming Meals</h3>
      </section>
    </div>
  );
};

export default Homepage;
