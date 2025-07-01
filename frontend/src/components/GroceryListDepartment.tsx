
import React from 'react'
import Ingredient from './Ingredient'
import { groceryList } from '../utils/sampleData'
import type { RecipeIngredientData } from '../utils/types'

const GroceryListDepartment = ({department, handleOpenModal}: {department: string, handleOpenModal: (ingredient: RecipeIngredientData) => void}) => {

    const filteredGroceries = groceryList.filter((item) => item.department === department)

    return (
        <div className="grocery-department">
            <h3>{department}</h3>
                {
                    filteredGroceries.map((item) => {
                        return (
                            <Ingredient ingredient={item} presentExpiration={false} presentButtons={true} onEdit={handleOpenModal}/>
                        )
                    })
                }
        </div>
    )
}

export default GroceryListDepartment