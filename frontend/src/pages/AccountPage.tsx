import React from "react";
import type { RecipeToggleNavBar } from "../utils/types";
import AppHeader from "../components/AppHeader";
import RegistrationPreferenceButtons from "../components/RegistrationPreferenceButtons";
import { Intollerances, Diets } from "../utils/enum";
import { useState, useEffect } from "react";
import "../styles/AccountPage.css";
import "../styles/LoginPage.css";

// code from firebase.google.com
import { auth } from "../utils/firebase";
import {
  onAuthStateChanged,
  EmailAuthProvider,
  updateEmail,
  reauthenticateWithCredential,
} from "firebase/auth";
import type { User } from "firebase/auth";
import { updateAccount, getUserData } from "../utils/databaseHelpers";

const AccountPage = ({ navOpen, toggleNav }: RecipeToggleNavBar) => {
  const [userIntollerances, setUserIntollerances] = useState<string[]>([]);
  const [userDiets, setUserDiets] = useState<string[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>()
  const [userEmail, setUserEmail] = useState<string>();
  const [userPassword, setUserPassword] = useState<string>();
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    // const user = auth.currentUser;
    onAuthStateChanged(auth, (user) => {
      if (user) {
        console.log("yay were signed in!", user);
        setCurrentUser(user);
        // get the users data from database (email, intollerances, diets)
        setUserInfo(user);
        setLoadingData(false);
      } else {
        console.log("no one singed in so sad ;-;");
      }
    });
  }, []);

  const setUserInfo = async (user: User) => {
    const userData = await getUserData(user);
    console.log("user data is", userData)
    if (userData) {
      setUserEmail(userData.userEmail);
      setUserIntollerances(userData.userIntollerances);
      setUserDiets(userData.userDiets);
    }
  }

  const handleIntolleranceClick = (event: React.MouseEvent<HTMLButtonElement>) => {
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

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    if (name === "email") {
      setUserEmail(value);
    } else if (name === "password") {
      setUserPassword(value);
    }
  };

  const handleAccountSubmit = () => {
    if (!userPassword) {
      // TODO Incoorporate error state component
      console.log("password required to continue");
      return;
    }
    const user = auth.currentUser;
    if (user && user.email && userEmail) {
      try {
        // validate credentials to update account
        const credential = EmailAuthProvider.credential(
          user.email,
          userPassword
        );
        // valdate credentials to update account
        reauthenticateWithCredential(user, credential)
          .then(() => {
            //if the users email was changed, update on firebase side too
            if (user.email && userEmail && user.email !== userEmail) {
              // get credential by signing user in with email
              updateEmail(user, userEmail)
                .then(() => {
                  console.log("updated email");
                })
                .catch((error) => {
                  console.log(error.code);
                  console.log("an error occurred when updating the email");
                });
            }
            // then update account in database
            updateAccount({user, userEmail, userIntollerances, userDiets});
          })
          .catch((error) => {
            console.log("an error occurred during reauthentication");
            console.log(error.code);
          });
      } catch (error) {
        console.log("oh no some error");
      }
    }
  };


  if(loadingData && currentUser) {
    return (
      <div>
        <AppHeader navOpen={navOpen} toggleNav={toggleNav} />
        <p>Loading Data</p>
      </div>
    )
  } else if (!currentUser) {
    return (
      <div className="account-page">
        <AppHeader navOpen={navOpen} toggleNav={toggleNav} />
        <p>Sign in to edit account details</p>
      </div>
    );
  }

  return (
    <div className="account-page">
      <AppHeader navOpen={navOpen} toggleNav={toggleNav} />
      <div className="account-info">
        <h1>Edit Account Details</h1>
        <div className="account-email">
          <h3>Email</h3>
          <input
            name="email"
            id="email"
            value={userEmail ? userEmail : ""}
            onChange={handleInputChange}
          />
        </div>
        <h2>Selected Intollerances</h2>
        <RegistrationPreferenceButtons
          list={Intollerances}
          userList={userIntollerances}
          handleButtonClick={handleIntolleranceClick}
        />
        <h2>Selected Diets</h2>
        <RegistrationPreferenceButtons
          list={Diets}
          userList={userDiets}
          handleButtonClick={handleDietClick}
        />
        <div className="confirm-password">
          <h3>Confirm Password</h3>
          <input
            type="password"
            name="password"
            id="password"
            onChange={handleInputChange}
            required
          />
        </div>
        <button type="submit" onClick={handleAccountSubmit}>
          Submit
        </button>
      </div>
    </div>
  );
};

export default AccountPage;
