import React from 'react'
import '../styles/IngredientsPage.css'
import { Units } from "../utils/enum"

const AddIngredientModal = ({onClose}: {onClose: () => void}) => {
    return (
        <div className="modal" id="add-ingredient-modal">
            <div className="modal-content">
                {/* <button className='modal-close' onClick={handleCloseModal}>&times;</button> */}
                <button className='modal-close' onClick={onClose}>&times;</button>
                <form className="add-ingredient-form">
                    <label htmlFor="ingredient-name">Ingredient Name</label>
                    <input id="ingredient-name"/>
                    <label htmlFor="ingredient-quantity">Quantity on Hand</label>
                    <div className='ingredient-quantity'>
                        <input id="ingredient-quantity"/>
                        <select defaultValue="unit">
                            {
                                Units.map((unit) => (
                                    <option key={unit} value={unit}>{unit}</option>
                                ))
                            }
                        </select>
                    </div>
                    <label htmlFor="ingredient-expiration">Ingredient Name</label>
                    <input id="ingredient-name"/>
                    <button type="submit" className="add-ingredient-button">Add Ingredient!</button>
                </form>
            </div>
        </div>
    )
}

export default AddIngredientModal