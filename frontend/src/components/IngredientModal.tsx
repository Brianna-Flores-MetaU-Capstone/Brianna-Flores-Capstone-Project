import React from 'react'
import '../styles/IngredientsPage.css'
import { Units, Departments } from "../utils/enum"
import type { IngredientData, UniversalIngredientModalProps } from '../utils/types'
import { useState } from 'react'
import TextField from '@mui/material/TextField'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import type { SelectChangeEvent } from '@mui/material/Select'
import InputLabel from '@mui/material/InputLabel'
import Button from '@mui/material/Button'
import { ingredientDataFields, INGREDIENT_MODAL } from '../utils/constants'

const IngredientModal: React.FC<UniversalIngredientModalProps> = ({modalFor, ingredientData, onClose}) => {
    const [newIngredientData, setNewIngredientData] = useState<IngredientData>(ingredientData ?? {
        department: "",
        image: "",
        name: "",
        quantity: "",
        unit: "unit",
        estimatedCost: 0,
        expirationDate: ""
    })
    
    const handleSelectChange = (event: SelectChangeEvent) => {
        const value = event.target.value;
        const ingredientfield = event.target.name as keyof IngredientData
        setNewIngredientData((prev) => ({...prev, [ingredientfield]: value}))
    };

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
                    <TextField required id="ingredient-name" name={ingredientDataFields.NAME} slotProps={{htmlInput: { "data-ingredientfield": "name"}}} onChange={handleInputChange} value={newIngredientData?.name} label="Ingredient Name" variant="standard" />
                    <div className='ingredient-quantity'>
                        <TextField required id="ingredient-quantity" name={ingredientDataFields.QUANTITY} slotProps={{htmlInput: { "data-ingredientfield": "quantity"}}} onChange={handleInputChange} value={newIngredientData?.quantity} label="Quantity" variant="standard" />
                        <Select id="unit" name={ingredientDataFields.UNIT} value={newIngredientData?.unit} onChange={handleSelectChange} label="unit">
                            {
                                Units.map((unit) => (
                                    <MenuItem key={unit} value={unit}>{unit}</MenuItem>
                                ))
                            }
                        </Select>
                    </div>
                    { modalFor === INGREDIENT_MODAL && <label htmlFor="ingredient-expiration">Expiration Date</label> }
                    { modalFor === INGREDIENT_MODAL && <input name={ingredientDataFields.EXPIRATION_DATE} type="date" data-ingredientfield="expirationDate" id="ingredient-expiration" value={newIngredientData?.expirationDate} onChange={handleInputChange} required/> }
                    <InputLabel>Select a Department</InputLabel>
                    <Select id={ingredientDataFields.DEPARTMENT} name={ingredientDataFields.DEPARTMENT} value={newIngredientData?.department} onChange={handleSelectChange} label="Department">
                        {
                            Departments.map((department) => (
                                <MenuItem key={department} value={department}>{department}</MenuItem>
                            ))
                        }
                    </Select>
                    <Button type="submit" className="add-button">{ingredientData? "Edit Ingredient!": "Add Ingredient!"}</Button>
                </form>
            </div>
        </div>
    )
}

export default IngredientModal