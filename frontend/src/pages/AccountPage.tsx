import React from "react";
import type { RecipeToggleNavBar } from "../utils/types";
import AppHeader from "../components/AppHeader";

const AccountPage = ({ navOpen, toggleNav }: RecipeToggleNavBar) => {
  return (
    <div>
      <AppHeader navOpen={navOpen} toggleNav={toggleNav} />
        <header>Edit Account Information</header>
    </div>
  );
};

export default AccountPage;
