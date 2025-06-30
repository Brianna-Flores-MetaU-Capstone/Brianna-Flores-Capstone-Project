import React from "react";
import type { RecipeToggleNavBar } from "../utils/types";
import AppHeader from "../components/AppHeader";
import RegistrationForm from "../components/RegistrationForm";
import RegistrationPreferenceButtons from "../components/RegistrationPreferenceButtons";
import { intollerances, diets } from "../utils/enum";
import { useState } from "react";
import "../styles/AccountPage.css";
import "../styles/LoginPage.css";

const AccountPage = ({ navOpen, toggleNav }: RecipeToggleNavBar) => {
  const [userIntollerances, setUserIntollerances] = useState<string[]>([]);
  const [userDiets, setUserDiets] = useState<string[]>([]);

  const handleIntolleranceClick = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    const selectedIntollerance = event.currentTarget.value;
    if (userIntollerances.includes(selectedIntollerance)) {
      setUserIntollerances((prev) =>
        prev.filter((intollerance) => intollerance !== selectedIntollerance)
      );
    } else {
      setUserIntollerances((prev) => [...prev, selectedIntollerance]);
    }
  };

  const handleDietClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    const selectedDiet = event.currentTarget.value;
    if (userDiets.includes(selectedDiet)) {
      setUserDiets((prev) => prev.filter((diet) => diet !== selectedDiet));
    } else {
      setUserDiets((prev) => [...prev, selectedDiet]);
    }
  };

  return (
    <div className="account-page">
      <AppHeader navOpen={navOpen} toggleNav={toggleNav} />
      <div className="account-info">
        <h1>Edit Account Details</h1>
        <div className="account-email">
          <h3>Email</h3>
          <input />
          <button>Submit</button>
        </div>
          <h2>Selected Intollerances</h2>
          <RegistrationPreferenceButtons
            list={intollerances}
            userList={userIntollerances}
            handleButtonClick={handleIntolleranceClick}
          />
        <h2>Selected Diets</h2>
        <RegistrationPreferenceButtons
          list={diets}
          userList={userDiets}
          handleButtonClick={handleDietClick}
        />
      </div>
    </div>
  );
};

export default AccountPage;
