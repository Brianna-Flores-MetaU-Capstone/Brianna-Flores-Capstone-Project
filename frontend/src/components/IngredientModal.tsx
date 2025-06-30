import React from 'react'
import '../styles/IngredientsPage.css'
import { Units } from "../utils/enum"
import type { IngredientData } from '../utils/types'
import { useState } from 'react'

const IngredientModal = ({ingredientData, onClose}: {ingredientData?: IngredientData, onClose: () => void}) => {
    const [newIngredientData, setNewIngredientData] = useState<IngredientData>(ingredientData ?? {
        department: "",
        image: "",
        name: "",
        quantity: "",
        unit: "",
        estimatedCost: 0,
        expirationDate: ""
    })
    
    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setNewIngredientData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const { value } = event.target;
        setNewIngredientData((prev) => ({...prev, unit: value}))
    }

    return (
        <div className="modal" id="ingredient-modal">
            <div className="modal-content">
                <button className='modal-close' onClick={onClose}>&times;</button>
                <form className="ingredient-form">
                    <label htmlFor="ingredient-name">Ingredient Name</label>
                    <input name="name" id="ingredient-name" value={newIngredientData?.name} onChange={handleInputChange} required/>
                    <label htmlFor="ingredient-quantity">Quantity on Hand</label>
                    <div className='ingredient-quantity'>
                        <input type="number" name="quantity" id="ingredient-quantity" value={newIngredientData?.quantity} onChange={handleInputChange} required/>
                        <select name="unit" value={newIngredientData?.unit} onChange={handleSelectChange} required>
                            {
                                Units.map((unit) => (
                                    <option key={unit} value={unit}>{unit}</option>
                                ))
                            }
                        </select>
                    </div>
                    <label htmlFor="ingredient-expiration">Expiration Date</label>
                    <input type="date" name="expirationDate" id="ingredient-expiration" value={newIngredientData?.expirationDate} onChange={handleInputChange} required/>
                    <label htmlFor="ingredient-department">Department</label>
                    <input name="department" id="ingredient-department" value={newIngredientData?.department} onChange={handleInputChange} required/>
                    {ingredientData? <button type="submit" className="add-ingredient-button">Edit Ingredient!</button>: <button type="submit" className="add-ingredient-button">Add Ingredient!</button>}
                </form>
            </div>
        </div>
    )
}

export default IngredientModal