import type { RecipeToggleNavBarProps } from "../utils/types";
import AppHeader from "../components/AppHeader";

const NoMatchPage: React.FC<RecipeToggleNavBarProps> = ({ navOpen, toggleNav }) => {
  return (
    <div>
      <AppHeader navOpen={navOpen} toggleNav={toggleNav} />
      NoMatchPage: error page not found
    </div>
  );
};

export default NoMatchPage;
