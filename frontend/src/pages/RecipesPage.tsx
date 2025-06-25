import "../styles/RecipesPage.css";
import { Outlet } from "react-router";
import NavBar from "../components/NavBar";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faTicket } from "@fortawesome/free-solid-svg-icons";

const RecipesPage = () => {
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
      RecipesPage
      <Outlet />
    </div>
  );
};

export default RecipesPage;
