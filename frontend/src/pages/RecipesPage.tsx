import '../styles/RecipesPage.css'
import { Outlet } from 'react-router';

const RecipesPage = () => {
    return (
        <div>
            RecipesPage
            <Outlet />
        </div>
    )
}

export default RecipesPage;