import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import NavBar from "../components/NavBar";
import type { navigationTypes } from "../utils/types";
import AppHeader from "../components/AppHeader";

const NoMatchPage = ({ navOpen, toggleNav }: navigationTypes) => {
  return (
    <div>
      <AppHeader navOpen={navOpen} toggleNav={toggleNav} />
      NoMatchPage: error page not found
    </div>
  );
};

export default NoMatchPage;
