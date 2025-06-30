import type { RecipeToggleNavBar } from "../utils/types";
import AppHeader from "../components/AppHeader";

const NoMatchPage = ({ navOpen, toggleNav }: RecipeToggleNavBar) => {
  return (
    <div>
      <AppHeader navOpen={navOpen} toggleNav={toggleNav} />
      NoMatchPage: error page not found
    </div>
  );
};

export default NoMatchPage;
