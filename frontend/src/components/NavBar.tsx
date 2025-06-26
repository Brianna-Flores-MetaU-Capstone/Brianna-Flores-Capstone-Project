import '../styles/Homepage.css'
import '../styles/NavBar.css'
import { NavLink, Link } from "react-router"


const NavBar = ({ toggleNav }: {toggleNav: () => void}) => {

    return (
        <nav className="navbar-container">
            <span className="close-nav" onClick={toggleNav}>
                &times;
            </span>
            {/* end: used so anything after "/" will generate respective content */}
            <NavLink to="/" className={({ isActive }) => 
                isActive ? "nav-active" : "nav-inactive"
            } onClick={toggleNav} end>
                Home
            </NavLink>
            <NavLink to="/new-list" className={({ isActive }) => 
                isActive ? "nav-active" : "nav-inactive"
            } onClick={toggleNav} >
                Create a New List
            </NavLink>
            <NavLink to="/ingredients" className={({ isActive }) => 
                isActive ? "nav-active" : "nav-inactive"
            } onClick={toggleNav} >
                Ingredients on Hand
            </NavLink>
            <NavLink to="/grocery-list" className={({ isActive }) => 
                isActive ? "nav-active" : "nav-inactive"
            } onClick={toggleNav} >
                Grocery List
            </NavLink>
            <NavLink to="/recipes" className={({ isActive }) => 
                isActive ? "nav-active" : "nav-inactive"
            } onClick={toggleNav} end>
                Recipes
            </NavLink>
        </nav>
    )
}

export default NavBar;