import React from 'react'
import '../styles/IngredientsPage.css'
import { Units, Departments } from "../utils/enum"
import type { IngredientData } from '../utils/types'
import { useState } from 'react'

const IngredientModal = ({modalFor, ingredientData, onClose}: {modalFor: string, ingredientData?: IngredientData, onClose: () => void}) => {
    const [newIngredientData, setNewIngredientData] = useState<IngredientData>(ingredientData ?? {
        department: "",
        image: "",
        name: "",
        quantity: "",
        unit: "",
        estimatedCost: 0,
        expirationDate: ""
    })
    
    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLSelectElement>) => {
        const ingredientfield = event.target.dataset.ingredientfield as keyof IngredientData
        const value = event.target.value;
        setNewIngredientData((prev) => ({ ...prev, [ingredientfield]: value }));
    };

    return (
        <div className="modal" id="ingredient-modal">
            <div className="modal-content">
                <button className='modal-close' onClick={onClose}>&times;</button>
                <form className="ingredient-form">
                    <label htmlFor="ingredient-name">Ingredient Name</label>
                    <input data-ingredientfield="name" id="ingredient-name" value={newIngredientData?.name} onChange={handleInputChange} required/>
                    <label htmlFor="ingredient-quantity">{modalFor === "ingredients-page" ? "Quantity on Hand" : "Quantity"}</label>
                    <div className='ingredient-quantity'>
                        <input type="number" data-ingredientfield="quantity" id="ingredient-quantity" value={newIngredientData?.quantity} onChange={handleInputChange} required/>
                        <select data-ingredientfield="unit" value={newIngredientData?.unit} onChange={handleInputChange} required>
                            {
                                Units.map((unit) => (
                                    <option key={unit} value={unit}>{unit}</option>
                                ))
                            }
                        </select>
                    </div>
                    { modalFor === "ingredients-page" && <label htmlFor="ingredient-expiration">Expiration Date</label> }
                    { modalFor === "ingredients-page" && <input type="date" data-ingredientfield="expirationDate" id="ingredient-expiration" value={newIngredientData?.expirationDate} onChange={handleInputChange} required/> }
                    <label htmlFor="ingredient-department">Department</label>
                    <select data-ingredientfield="department" id="ingredient-department" value={newIngredientData?.department} onChange={handleInputChange}>
                        {
                            Departments.map((department: string) => {
                                return (
                                    <option key={department}>{department}</option>
                                )
                            })
                        }
                    </select>
                    {ingredientData? <button type="submit" className="add-button">Edit Ingredient!</button>: <button type="submit" className="add-button">Add Ingredient!</button>}
                </form>
            </div>
        </div>
    )
}

export default IngredientModal