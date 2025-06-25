import '../styles/GroceryList.css'
import NavBar from '../components/NavBar';
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faTicket } from "@fortawesome/free-solid-svg-icons";

const GroceryList = () => {
    const [navOpen, setNavOpen] = useState<boolean>(false);
    
    const toggleNav = () => {
        setNavOpen((prev) => !prev);
    };
    return (
        <div>
            <button onClick={toggleNav}>
                <FontAwesomeIcon
                icon={faBars}
                className="nav-icon"
                onClick={toggleNav}
                />
            </button>
            {navOpen && <NavBar onCloseNav={toggleNav} />}
            GroceryList
        </div>
    )
}

export default GroceryList;