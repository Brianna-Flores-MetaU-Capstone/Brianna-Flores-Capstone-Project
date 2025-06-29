import "../styles/Homepage.css";
import NavBar from "../components/NavBar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import type {navigationTypes} from '../utils/types'
import { useNavigate } from "react-router";

import { auth } from "../utils/firebase"

import { groceryList } from "../utils/sampleData";

import NextRecipe from "../components/NextRecipe";
import IngredientsPreview from "../components/IngredientsPreview";
import GroceryPreview from "../components/GroceryPreview";



const Homepage = ( {navOpen, toggleNav} : navigationTypes) => {

  const user = auth.currentUser;
  const navigate = useNavigate();

  if (user) {
    // User is signed in, see docs for a list of available properties
    // https://firebase.google.com/docs/reference/js/auth.user
    // ...
    console.log("user is signed in: ", user);
  } else {
    // No user is signed in.
    console.log("no user signed in")
  }

  return (
    <div className="homepage-container">
      <section className="homepage-header">
        <header><h1>Grocery Buddy *insert better title lol*</h1></header>
        <button className="login-button" onClick={() => navigate("/login")}>Login</button>
        <button className="nav-button" onClick={toggleNav}>
          <FontAwesomeIcon
            icon={faBars}
            className="nav-icon"
          />
        </button>
        {navOpen && <NavBar toggleNav={toggleNav} />}
      </section>
      <section className="quick-access-container">
        <NextRecipe />
        <IngredientsPreview />
        <GroceryPreview groceryList={groceryList}/>
      </section>
      <section className="upcoming-meals">
        <h3>Upcoming Meals</h3>

      </section>
    </div>
  );
};

export default Homepage;
