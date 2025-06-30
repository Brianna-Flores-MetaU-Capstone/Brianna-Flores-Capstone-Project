import '../styles/GroceryList.css'
import type {RecipeToggleNavBar} from '../utils/types'
import AppHeader from '../components/AppHeader';

const GroceryList = ( {navOpen, toggleNav} : RecipeToggleNavBar) => {
    return (
        <div>
            <AppHeader navOpen={navOpen} toggleNav={toggleNav} />
            GroceryList
        </div>
    )
}

export default GroceryList;