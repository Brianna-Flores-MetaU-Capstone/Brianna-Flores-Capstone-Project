import React from "react"
import Ingredient from "./Ingredient"
import "../styles/Homepage.css"
import type { IngredientData } from "../utils/types";
import { v4 as uuidv4 } from "uuid";

const IngredientsPreview = ({ingredientsList}: {ingredientsList: IngredientData[]}) => {
    return (
        <div className="ingredient-preview">
            <h3>Ingredients on Hand</h3>
            <div className="list-items">
            {
                ingredientsList.map((ingredient) => {
                    return (
                         <Ingredient key={uuidv4()} ingredient={ingredient} extendedInfo={false}/>
                    )
                })
            }
            </div>
        </div>
    )
}

export default IngredientsPreview