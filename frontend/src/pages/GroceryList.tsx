import '../styles/GroceryList.css'
import type {RecipeToggleNavBar} from '../utils/types'
import AppHeader from '../components/AppHeader';
import GroceryListDepartment from '../components/GroceryListDepartment';
import type { RecipeIngredientData } from '../utils/types'
import { useState } from 'react'
import IngredientModal from '../components/IngredientModal';

const GroceryList = ( {navOpen, toggleNav} : RecipeToggleNavBar) => {
    const [editGroceryItemData, setEditGroceryItemData] = useState<RecipeIngredientData>()
    const [editGroceryItemModalOpen, setEditGroceryItemModalOpen] = useState(false)
    const [addGroceryItemModalOpen, setAddGroceryItemModalOpen] = useState(false)

    const handleAddGrocery = () => {
        setAddGroceryItemModalOpen((prev) => !prev)
    }

    const handleEditGrocery = (ingredient: RecipeIngredientData) => {
        setEditGroceryItemData(ingredient)
        setEditGroceryItemModalOpen((prev) => !prev)
    }

    return (
        <div>
            <AppHeader navOpen={navOpen} toggleNav={toggleNav} />
            <div className="grocery-list-container">
                <button className="add-grocery-item" onClick={handleAddGrocery}>Add Item</button>
                <GroceryListDepartment department="dairy" handleOpenModal={handleEditGrocery}/>
            </div>
            {addGroceryItemModalOpen && <IngredientModal modalFor="grocery-page" onClose={handleAddGrocery}/>}
            {editGroceryItemModalOpen && <IngredientModal modalFor="grocery-page" ingredientData={editGroceryItemData} onClose={() => setEditGroceryItemModalOpen((prev) => !prev)} />}
        </div>
    )
}

export default GroceryList;