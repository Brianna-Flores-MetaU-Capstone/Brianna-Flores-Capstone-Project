
import React from 'react'
import Ingredient from './Ingredient'
import { ingredients } from '../utils/sampleData'
import type { RecipeIngredientData } from '../utils/types'

const GroceryListDepartment = ({department, handleOpenModal}: {department: string, handleOpenModal: (ingredient: RecipeIngredientData) => void}) => {
    return (
        <div className="grocery-department">
            <h3>{department}</h3>
            <Ingredient ingredient={ingredients[0]} presentExpiration={false} presentButtons={true} onEdit={handleOpenModal}/>
        </div>
    )
}

export default GroceryListDepartment