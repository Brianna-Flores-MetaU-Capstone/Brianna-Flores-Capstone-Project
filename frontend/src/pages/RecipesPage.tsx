import "../styles/RecipesPage.css";
import { Outlet } from "react-router";
import type { navigationTypes } from "../utils/types";
import AppHeader from "../components/AppHeader";

const RecipesPage = ({ navOpen, toggleNav }: navigationTypes) => {
  return (
    <div>
      <AppHeader navOpen={navOpen} toggleNav={toggleNav} />
      RecipesPage
      <Outlet />
    </div>
  );
};

export default RecipesPage;
