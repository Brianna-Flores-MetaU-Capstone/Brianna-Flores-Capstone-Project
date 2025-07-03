import React from 'react'
import '../styles/IngredientsPage.css'
import { Units, Departments } from "../utils/enum"
import type { IngredientData } from '../utils/types'
import { useState } from 'react'
import TextField from '@mui/material/TextField'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import type { SelectChangeEvent } from '@mui/material/Select'

const IngredientModal = ({modalFor, ingredientData, onClose}: {modalFor: string, ingredientData?: IngredientData, onClose: () => void}) => {
    const [newIngredientData, setNewIngredientData] = useState<IngredientData>(ingredientData ?? {
        department: "",
        image: "",
        name: "",
        quantity: "",
        unit: "unit",
        estimatedCost: 0,
        expirationDate: ""
    })
    
    // const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const handleSelectChange = (event: SelectChangeEvent) => {
        // const ingredientfield = event.target.dataset.ingredientfield as keyof IngredientData
        const value = event.target.value;
        const ingredientfield = event.target.name as keyof IngredientData
        setNewIngredientData((prev) => ({...prev, [ingredientfield]: value}))
    };
    // const handleInputChange = (event: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLSelectElement>) => {
    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const ingredientfield = event.target.name as keyof IngredientData
        const value = event.target.value;
        setNewIngredientData((prev) => ({ ...prev, [ingredientfield]: value }));
    };

    return (
        <div className="modal" id="ingredient-modal">
            <div className="modal-content">
                <button className='modal-close' onClick={onClose}>&times;</button>
                <form className="ingredient-form">
                    <TextField required id="ingredient-name" name="name" slotProps={{htmlInput: { "data-ingredientfield": "name"}}} onChange={handleInputChange} value={newIngredientData?.name} label="Ingredient Name" variant="standard" />
                    <div className='ingredient-quantity'>
                        <TextField required id="ingredient-quantity" name="quantity" slotProps={{htmlInput: { "data-ingredientfield": "quantity"}}} onChange={handleInputChange} value={newIngredientData?.quantity} label="Quantity" variant="standard" />
                        <Select id="unit" name="unit" value={newIngredientData?.unit} onChange={handleSelectChange} label="unit">
                            {
                                Units.map((unit) => (
                                    <MenuItem key={unit} value={unit}>{unit}</MenuItem>
                                ))
                            }
                        </Select>
                    </div>
                    { modalFor === "ingredients-page" && <label htmlFor="ingredient-expiration">Expiration Date</label> }
                    { modalFor === "ingredients-page" && <input type="date" data-ingredientfield="expirationDate" id="ingredient-expiration" value={newIngredientData?.expirationDate} onChange={handleInputChange} required/> }
                    <label htmlFor="ingredient-department">Department</label>
                    <Select id="department" name="department" value={newIngredientData?.department} onChange={handleSelectChange} label="Department">
                        {
                            Departments.map((department) => (
                                <MenuItem key={department} value={department}>{department}</MenuItem>
                            ))
                        }
                    </Select>
                    {ingredientData? <button type="submit" className="add-button">Edit Ingredient!</button>: <button type="submit" className="add-button">Add Ingredient!</button>}
                </form>
            </div>
        </div>
    )
}

export default IngredientModal