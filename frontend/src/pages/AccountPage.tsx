import React from "react";
import type { RecipeToggleNavBar } from "../utils/types";
import AppHeader from "../components/AppHeader";
import RegistrationPreferenceButtons from "../components/RegistrationPreferenceButtons";
import { Intolerances, Diets } from "../utils/enum";
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
import { PreferenceList, Authentication } from "../utils/constants";

const AccountPage = ({ navOpen, toggleNav }: RecipeToggleNavBar) => {
  const [userIntolerances, setUserIntolerances] = useState<string[]>([]);
  const [userDiets, setUserDiets] = useState<string[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>()
  const [userEmail, setUserEmail] = useState<string>();
  const [userPassword, setUserPassword] = useState<string>();
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUser(user);
        setUserInfo(user);
        setLoadingData(false);
      }
    });
  }, []);

  const setUserInfo = async (user: User) => {
    const userData = await getUserData(user);
    if (userData) {
      setUserEmail(userData.userEmail);
      setUserIntolerances(userData.userIntolerances);
      setUserDiets(userData.userDiets);
    }
  }


  const handlePreferenceClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    const { name, value } = event.currentTarget
    const setterFunction = name === PreferenceList.INTOLERANCES ? setUserIntolerances : setUserDiets;
    const userList = name === PreferenceList.INTOLERANCES ? userIntolerances : userDiets;
    if (userList.includes(value)) {
      setterFunction((prev) =>
        prev.filter((item) => item !== value)
      );
    } else {
      setterFunction((prev) => [...prev, value]);
    }
  }

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    if (name === Authentication.EMAIL) {
      setUserEmail(value);
    } else if (name === Authentication.PASSWORD) {
      setUserPassword(value);
    }
  };

  const handleAccountSubmit = () => {
    if (!userPassword) {
      console.log("TODO: Incoorporate error component after merging");
      console.log("password required to continue");
      return;
    }
    const user = auth.currentUser;
    if (user && user.email && userEmail) {
      try {
        // validate credentials to update account
        const credential = EmailAuthProvider.credential(user.email, userPassword);
        // valdate credentials to update account
        reauthenticateWithCredential(user, credential)
          .then(() => {
            //if the users email was changed, update on firebase side too
            if (user.email && userEmail && user.email !== userEmail) {
              // get credential by signing user in with email
              updateEmail(user, userEmail)
                .catch((error) => {
                  console.log("TODO: Incoorporate error component after merging");
                  console.log("an error occurred when updating the email");
                  console.log(error.code);
                });
            }
            // then update account in database
            updateAccount({user, userEmail, userIntolerances, userDiets});
          })
          .catch((error) => {
            console.log("TODO: Incoorporate error component after merging");
            console.log("an error occurred during reauthentication");
            console.log(error.code);
          });
      } catch (error) {
        console.log("TODO: Incoorporate error component after merging");
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
            name={Authentication.EMAIL}
            id={Authentication.EMAIL}
            value={userEmail ? userEmail : ""}
            onChange={handleInputChange}
          />
        </div>
        <h2>Selected Intolerances</h2>
        <RegistrationPreferenceButtons listName={PreferenceList.INTOLERANCES} listItems={Intolerances} userList={userIntolerances} handleButtonClick={handlePreferenceClick}/>
        <h2>Selected Diets</h2>
        <RegistrationPreferenceButtons listName={PreferenceList.DIETS} listItems={Diets} userList={userDiets} handleButtonClick={handlePreferenceClick}/>
        <div className="confirm-password">
          <h3>Confirm Password</h3>
          <input type="password" name={Authentication.PASSWORD} id={Authentication.PASSWORD} onChange={handleInputChange} required/>
        </div>
        <button type="submit" onClick={handleAccountSubmit}>
          Submit
        </button>
      </div>
    </div>
  );
};

export default AccountPage;
