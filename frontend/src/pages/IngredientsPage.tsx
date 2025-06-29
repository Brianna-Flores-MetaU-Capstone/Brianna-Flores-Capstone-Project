import "../styles/IngredientsPage.css";
import type { navigationTypes } from "../utils/types";
import AppHeader from "../components/AppHeader";

const IngredientsPage = ({ navOpen, toggleNav }: navigationTypes) => {
  return (
    <div>
      <AppHeader navOpen={navOpen} toggleNav={toggleNav}/>
    </div>
  );
};

export default IngredientsPage;
