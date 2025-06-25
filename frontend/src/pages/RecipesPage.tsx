import '../styles/RecipesPage.css'
import { Outlet } from 'react-router';
import NavBar from '../components/NavBar';


const RecipesPage = () => {
    return (
        <div>
            <NavBar />
            RecipesPage
            <Outlet />
        </div>
    )
}

export default RecipesPage;