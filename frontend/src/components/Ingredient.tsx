import React from "react"
import type { RecipeIngredientData } from "../utils/types"
import "../styles/Homepage.css"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare, faTrash } from "@fortawesome/free-solid-svg-icons";


const Ingredient = ({ingredient, extendedInfo, onEdit}: {ingredient: RecipeIngredientData; extendedInfo: boolean, onEdit?: (ingredient: RecipeIngredientData) => void}) => {
    return (
        <div className="list-ingredient">
            <p className="ingredient-name">{ingredient.name}</p>
            <p className="ingredient-amount">{`${ingredient.quantity} ${ingredient.unit}`}</p>
            {extendedInfo && <p className="ingredient-expiration">{ingredient.expirationDate}</p>}
            {extendedInfo && 
                <div className="ingredient-buttons-container">
                    <FontAwesomeIcon icon={faPenToSquare} className="ingredient-button" onClick={() => onEdit?.(ingredient)}/>
                    <FontAwesomeIcon icon={faTrash} className="ingredient-button"/>
                </div>
            }
        </div>
    )
}

export default Ingredient