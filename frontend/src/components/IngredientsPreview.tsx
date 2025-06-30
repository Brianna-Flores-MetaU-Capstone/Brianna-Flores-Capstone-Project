import React from "react"
import Ingredient from "./Ingredient"
import "../styles/Homepage.css"
import type { ingredientType } from "../utils/types";

let count = 0;

const IngredientsPreview = ({ingredientsList}: {ingredientsList: ingredientType[]}) => {
    return (
        <div className="ingredient-preview">
            <h3>Ingredients on Hand</h3>
            <div className="list-items">
            {
                ingredientsList.map((ingredient) => {
                    return (
                         <Ingredient key={count++} ingredient={ingredient} extendedInfo={false}/>
                    )
                })
            }
            </div>
        </div>
    )
}

export default IngredientsPreview