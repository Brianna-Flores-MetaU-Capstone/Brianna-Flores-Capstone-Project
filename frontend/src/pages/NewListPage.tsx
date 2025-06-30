import "../styles/NewListPage.css";
import type { RecipeToggleNavBar } from "../utils/types";
import AppHeader from "../components/AppHeader";

const NewListPage = ({ navOpen, toggleNav }: RecipeToggleNavBar) => {
  return (
    <div>
      <AppHeader navOpen={navOpen} toggleNav={toggleNav}/>
    </div>
  );
};

export default NewListPage;
