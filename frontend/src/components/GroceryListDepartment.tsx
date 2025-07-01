
import React from 'react'
import Ingredient from './Ingredient'
import { groceryList } from '../utils/sampleData'
import type { IngredientData } from '../utils/types'

const GroceryListDepartment = ({department, handleOpenModal}: {department: string, handleOpenModal: (ingredient: IngredientData) => void}) => {

    const filteredGroceries = groceryList.filter((item) => item.department === department)

    return (
        <div className="grocery-department">
            <h3 className="department-header">{department}</h3>
                {
                    filteredGroceries.map((item) => {
                        return (
                            <Ingredient key={item.name} ingredient={item} groceryCheck={true} presentExpiration={false} presentButtons={true} onEdit={handleOpenModal}/>
                        )
                    })
                }
        </div>
    )
}

export default GroceryListDepartment