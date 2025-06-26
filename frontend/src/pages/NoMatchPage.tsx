import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import NavBar from "../components/NavBar";
import type {navigationTypes} from '../utils/types'

const NoMatchPage = ( {navOpen, toggleNav} : navigationTypes) => {
    return (
        <div>
            <button onClick={toggleNav}>
                <FontAwesomeIcon
                icon={faBars}
                className="nav-icon"
                />
            </button>
            {navOpen && <NavBar toggleNav={toggleNav} />}
            NoMatchPage: error page not found
        </div>
    )
}

export default NoMatchPage;