import React from 'react'
import '../styles/IngredientsPage.css'
import { Units } from "../utils/enum"

const AddIngredientModal = () => {
    return (
        <div className="modal" id="add-ingredient-modal">
            <div className="modal-content">
                {/* <button className='modal-close' onClick={handleCloseModal}>&times;</button> */}
                <button className='modal-close'>&times;</button>
                <form className="add-ingredient-form">
                    <label htmlFor="ingredient-name">Ingredient Name</label>
                    <input id="ingredient-name"/>
                    <label htmlFor="ingredient-quantity">Quantity on Hand</label>
                    <input id="ingredient-quantity"/>
                    <select>
                        {
                            Units.map((unit) => (
                                <option key={unit} value={unit}>{unit}</option>
                            ))
                        }
                    </select>
                    <label htmlFor="ingredient-expiration">Ingredient Name</label>
                    <input id="ingredient-name"/>
                    <button type="submit">Add Ingredient!</button>
                </form>
            </div>
        </div>
    )
}

export default AddIngredientModal