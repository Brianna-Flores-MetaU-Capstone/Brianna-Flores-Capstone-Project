import "../styles/NewListPage.css";
import type { navigationTypes } from "../utils/types";
import AppHeader from "../components/AppHeader";

const NewListPage = ({ navOpen, toggleNav }: navigationTypes) => {
  return (
    <div>
      <AppHeader navOpen={navOpen} toggleNav={toggleNav}/>
    </div>
  );
};

export default NewListPage;
