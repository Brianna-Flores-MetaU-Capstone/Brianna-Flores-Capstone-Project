import "../styles/Homepage.css";
import "../styles/NavBar.css";
import { NavLink } from "react-router";
import type { GPToggleNavBarProps } from "../utils/types";

const NavBar: React.FC<GPToggleNavBarProps> = ({ toggleNav, navOpen }) => {
  return (
    <nav className={`navbar-container ${navOpen ? "nav-open" : "nav-close"}`}>
      <span className="close-nav" onClick={toggleNav}>
        &times;
      </span>
      <NavLink
        to="/"
        className={({ isActive }) => (isActive ? "nav-active" : "nav-inactive")}
        onClick={toggleNav}
        end
      >
        Home
      </NavLink>
      <NavLink
        to="/new-list"
        className={({ isActive }) => (isActive ? "nav-active" : "nav-inactive")}
        onClick={toggleNav}
      >
        Create a New List
      </NavLink>
      <NavLink
        to="/ingredients"
        className={({ isActive }) => (isActive ? "nav-active" : "nav-inactive")}
        onClick={toggleNav}
      >
        Ingredients on Hand
      </NavLink>
      <NavLink
        to="/grocery-list"
        className={({ isActive }) => (isActive ? "nav-active" : "nav-inactive")}
        onClick={toggleNav}
      >
        Grocery List
      </NavLink>
      <NavLink
        to="/recipes"
        className={({ isActive }) => (isActive ? "nav-active" : "nav-inactive")}
        onClick={toggleNav}
        end
      >
        Recipes
      </NavLink>
      <NavLink
        to="/account"
        className={({ isActive }) => (isActive ? "nav-active" : "nav-inactive")}
        onClick={toggleNav}
        end
      >
        Account
      </NavLink>
    </nav>
  );
};

export default NavBar;
