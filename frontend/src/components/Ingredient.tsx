import React from "react"
import type { ingredientType } from "../utils/types"
import "../styles/Homepage.css"

const Ingredient = ({ingredient}: {ingredient: ingredientType}) => {
    return (
        <div className="list-ingredient">
            <p>{ingredient.name}</p>
            <p>{`${ingredient.amount} ${ingredient.unit}`}</p>
        </div>
    )
}

export default Ingredient