import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faTicket } from "@fortawesome/free-solid-svg-icons";
import NavBar from "../components/NavBar";

const NoMatchPage = () => {

const [navOpen, setNavOpen] = useState<boolean>(false);

    return (
        <div>
            <button onClick={() => setNavOpen((prev) => !prev)}>
                <FontAwesomeIcon
                icon={faBars}
                className="nav-icon"
                onClick={() => setNavOpen((prev) => !prev)}
                />
            </button>
            {navOpen && <NavBar onCloseNav={() => setNavOpen((prev) => !prev)} />}
            NoMatchPage: error page not found
        </div>
    )
}

export default NoMatchPage;