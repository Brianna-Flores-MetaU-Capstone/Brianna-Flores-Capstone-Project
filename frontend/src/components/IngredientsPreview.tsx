import React from "react"
import { ingredients } from "../utils/sampleData"
import Ingredient from "./Ingredient"
import "../styles/Homepage.css"

let count = 0;

const IngredientsPreview = () => {
    console.log(ingredients);
    return (
        <div className="ingredient-preview">
            <h3>Ingredients on Hand</h3>
            {
                ingredients.map((ingredient) => {
                    return (
                         <Ingredient key={count++} ingredient={ingredient}/>
                    )
                })
            }
        </div>
    )
}

export default IngredientsPreview