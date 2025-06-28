import React from "react"
import { ingredients } from "../utils/sampleData"
import Ingredient from "./Ingredient"

let count = 0;

const IngredientsPreview = () => {
    console.log(ingredients);
    return (
        <div className="ingredient-preview">
            <h3>Ingredients on Hand</h3>
            {
                
            }
        </div>
    )
}

export default IngredientsPreview