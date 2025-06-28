import React from "react"
import type { ingredientType } from "../utils/types"

const Ingredient = (ingredientData: ingredientType) => {
    return (
        <div>
            <p>{ingredientData.name}</p>
            <p>{`${ingredientData.amount}${ingredientData.unit} left`}</p>
        </div>
    )
}

export default Ingredient