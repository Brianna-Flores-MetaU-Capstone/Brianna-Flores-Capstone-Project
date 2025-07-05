import "../styles/RecipesPage.css";
import { Outlet } from "react-router";
import type { GPToggleNavBarProps } from "../utils/types";
import AppHeader from "../components/AppHeader";

const RecipesPage: React.FC<GPToggleNavBarProps> = ({ navOpen, toggleNav }) => {
  return (
    <div>
      <AppHeader navOpen={navOpen} toggleNav={toggleNav} />
      RecipesPage
      <Outlet />
    </div>
  );
};

export default RecipesPage;
