import type { GPToggleNavBarProps } from "../utils/types";
import AppHeader from "../components/AppHeader";

const NoMatchPage: React.FC<GPToggleNavBarProps> = ({ navOpen, toggleNav }) => {
  return (
    <div>
      <AppHeader navOpen={navOpen} toggleNav={toggleNav} />
      NoMatchPage: error page not found
    </div>
  );
};

export default NoMatchPage;
