import React from 'react'
import "../styles/Meal.css"
import { useState } from 'react'

import dotenv from 'dotenv'; 
dotenv.config();

const AddAnotherMealModal = ({handleModalClose}: {handleModalClose: () => void}) => {
    const [mealRequest, setMealRequest] = useState({ recipe: "", servings: ""})
    const [mealResults, setMealResults] = useState([]);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setMealRequest((prev) => ({ ...prev, [name]: value }));
    };

    // fetch recipes from API dependent on user input
    const fetchSearchRecipes = async () => {
        // const API_KEY = process.env.VITE_API_KEY
        try {
            const response = await fetch(`https://api.spoonacular.com/recipes/complexSearch?apiKey=<INSERT API KEY>&query=${mealRequest.recipe}&number=3&addRecipeInformation=true&fillIngredients=true`)
            if (!response.ok) {
                throw new Error("Failed to fetch gifs");
            }
            const data = await response.json();
            console.log(data)
            setMealResults(data)
        } catch (error) {
            console.error(error)
        }
    }

    const handleSearchRecipes = () => {
        fetchSearchRecipes()
    }

    return (
        <section className='modal' id="meal-modal">
            <div className='modal-content mealModal'>
                <button className='modal-close' onClick={handleModalClose}>&times;</button>
                <button>Need Some Inspiration?</button>
                <button>I Have My Own Recipe</button>
                <form className="meal-form">
                    <label htmlFor="recipe">Recipe</label>
                    <input type="text" name="recipe" value={mealRequest.recipe} onChange={handleChange} required/>
                    <label htmlFor="servings">Servings</label>
                    <input type="text" name="servings" value={mealRequest.servings} onChange={handleChange} required/>
                    <button onClick={handleSearchRecipes}>Find Some Recipes!</button>
                </form>

            </div>
        </section>
    )
}

export default AddAnotherMealModal