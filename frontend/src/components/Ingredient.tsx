import React from "react"
import type { ingredientType } from "../utils/types"
import "../styles/Homepage.css"

interface IngredientTypeInformation {
    ingredient: ingredientType
    extendedInfo: boolean
}

const Ingredient = ({ingredient, extendedInfo}: IngredientTypeInformation) => {
    return (
        <div className="list-ingredient">
            <p className="ingredient-name">{ingredient.name}</p>
            <p className="ingredient-amount">{`${ingredient.amount} ${ingredient.unit}`}</p>
            {extendedInfo && <p className="ingredient-expiration">{ingredient.expirationDate}</p>}
        </div>
    )
}

export default Ingredient