import '../styles/GroceryList.css'
import NavBar from '../components/NavBar';
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faTicket } from "@fortawesome/free-solid-svg-icons";
import type {navigationTypes} from '../utils/types'

const GroceryList = ( {navOpen, toggleNav} : navigationTypes) => {
    return (
        <div>
            <button onClick={toggleNav}>
                <FontAwesomeIcon
                icon={faBars}
                className="nav-icon"
                onClick={toggleNav}
                />
            </button>
            {navOpen && <NavBar toggleNav={toggleNav} />}
            GroceryList
        </div>
    )
}

export default GroceryList;