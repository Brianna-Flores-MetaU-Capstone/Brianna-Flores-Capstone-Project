import React from "react";
import "../styles/Meal.css";
import { useState } from "react";
import MealCard from "./MealCard";

import type { searchRequestType, recipeType } from "../utils/types";
import { parseRecipeData } from "../utils/utils";

const API_KEY = import.meta.env.VITE_APP_API_KEY;
const GROUP_OF_DISPLAYED_CARDS = 3;
const TOTAL_SEARCH_REQUESTS = 6;

interface AddAnotherMealTypes {
    handleModalClose: () => void
    onSelectRecipe: (data: recipeType) => void
}

const AddAnotherMealModal = ({handleModalClose, onSelectRecipe}: AddAnotherMealTypes) => {
  const [mealRequest, setMealRequest] = useState({ recipe: "", days: "" });
  const [mealResults, setMealResults] = useState<recipeType[]>([]);
  const [searchClicked, setSearchClicked] = useState(false); // search recipes button clicked
  const [numInDatabase, setNumInDatabase] = useState(0);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setMealRequest((prev) => ({ ...prev, [name]: value }));
  };

  // fetch recipes from API dependent on user input
  const fetchSearchRecipes = async ({ numToRequest, offset }: searchRequestType) => {
    try {
      const response = await fetch(
        `https://api.spoonacular.com/recipes/complexSearch?apiKey=${API_KEY}&query=${mealRequest.recipe}&number=${numToRequest}&addRecipeInformation=true&fillIngredients=true&offset=${offset}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch searched recipes");
      }
      const data = await response.json();
      const parsedRecipes = parseRecipeData(data.results)
      if (searchClicked) {
        setMealResults((prev) => [...prev, ...parsedRecipes]);
      } else {
          setMealResults(parsedRecipes);
      }

      // TODO: add fetched recipes to database
      // helper method
    } catch (error) {
      console.error(error);
    }
  };

  const fetchRandomRecipes = async () => {
    // TODO take into account user ingredients
    try {
      const response = await fetch(
        `https://api.spoonacular.com/recipes/findByIngredients?apiKey=${API_KEY}&ingredients=bread,cheese,pasta,spinach,tomato,avocado,cottage cheese,flour,sugar,pesto,banana&number=3&ranking=2`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch random recipes");
      }
      const data = await response.json();
      // array of recipes
      setMealResults(data);

      // TODO: check if recipes are in database (according to id), otherwise add to database
      // helper method (due to repeated code)
    } catch (error) {
      console.error(error);
    }
  };

  const handleFetchRecipes = () => {
    const numToRequest = TOTAL_SEARCH_REQUESTS - numInDatabase;
    // calculate offset; assume recipes in database are first n from database, offset by that number
    if (numToRequest > 0) {
        if (numToRequest % 3 === 0) {
            fetchSearchRecipes({numToRequest: GROUP_OF_DISPLAYED_CARDS, offset: numInDatabase})
            setNumInDatabase((prev) => prev + GROUP_OF_DISPLAYED_CARDS);
        } else {
            fetchSearchRecipes({numToRequest: (GROUP_OF_DISPLAYED_CARDS - (numInDatabase % 3)), offset: numInDatabase})
            setNumInDatabase(
                (prev) => prev + GROUP_OF_DISPLAYED_CARDS - (numInDatabase % 3)
            );
        }
    }
  }

  const handleSearchSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    // TODO: check if recipes in database and set numInDatabase, fetch only recipes required
    handleFetchRecipes();
    setSearchClicked(true);
  };

  const handleGenerateMore = (event: React.MouseEvent<HTMLButtonElement>) => {
    handleFetchRecipes();
    setSearchClicked(false);
  }

  return (
    <section className="modal" id="meal-modal">
      <div className="modal-content mealModal">
        <button className="modal-close" onClick={handleModalClose}>
          &times;
        </button>
        <button onClick={() => fetchRandomRecipes()}>
        {/* <button> */}
          Need Some Inspiration?
        </button>
        <button>I Have My Own Recipe</button>
        <form className="meal-form" onSubmit={handleSearchSubmit}>
          <label htmlFor="recipe">Recipe</label>
          <input
            type="text"
            name="recipe"
            value={mealRequest.recipe}
            onChange={handleChange}
            required
          />
          <label htmlFor="days">Days to Eat</label>
          <input
            type="text"
            name="days"
            value={mealRequest.days}
            onChange={handleChange}
            required
          />
          <button>Find Some Recipes!</button>
        </form>

        <section className="result-cards">
            {
                mealResults.map((meal) => {
                    return (
                        <MealCard key={meal.id} onMealCardClick={() => event?.preventDefault()} parsedMealData={meal} onSelectRecipe={onSelectRecipe}/>
                    )
                })
            }
        </section>

        {/* if search clicked, add a generate more button */}
        {searchClicked && (
          <button onClick={handleGenerateMore}>
            Generate More!
          </button>
        )}
      </div>
    </section>
  );
};

export default AddAnotherMealModal;
