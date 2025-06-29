import '../styles/GroceryList.css'
import type {navigationTypes} from '../utils/types'
import AppHeader from '../components/AppHeader';

const GroceryList = ( {navOpen, toggleNav} : navigationTypes) => {
    return (
        <div>
            <AppHeader navOpen={navOpen} toggleNav={toggleNav} />
            GroceryList
        </div>
    )
}

export default GroceryList;