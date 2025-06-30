import React from "react"
import type { RecipeIngredientData } from "../utils/types"
import "../styles/Homepage.css"

const Ingredient = ({ingredient, extendedInfo}: {ingredient: RecipeIngredientData; extendedInfo: boolean}) => {
    return (
        <div className="list-ingredient">
            <p className="ingredient-name">{ingredient.name}</p>
            <p className="ingredient-amount">{`${ingredient.amount} ${ingredient.unit}`}</p>
            {extendedInfo && <p className="ingredient-expiration">{ingredient.expirationDate}</p>}
        </div>
    )
}

export default Ingredient