import "../styles/RecipesPage.css";
import { Outlet } from "react-router";
import type { RecipeToggleNavBarProps } from "../utils/types";
import AppHeader from "../components/AppHeader";

const RecipesPage: React.FC<RecipeToggleNavBarProps> = ({ navOpen, toggleNav }) => {
  return (
    <div>
      <AppHeader navOpen={navOpen} toggleNav={toggleNav} />
      RecipesPage
      <Outlet />
    </div>
  );
};

export default RecipesPage;
