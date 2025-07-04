import React from "react";
import AppHeader from "../components/AppHeader";
import RegistrationPreferenceButtons from "../components/RegistrationPreferenceButtons";
import type { RecipeToggleNavBarProps } from "../utils/types";
import { Intolerances, Diets } from "../utils/enum";
import { useState, useEffect } from "react";
import "../styles/AccountPage.css";
import "../styles/LoginPage.css";
import { auth } from "../utils/firebase";
import { onAuthStateChanged, EmailAuthProvider, updateEmail, reauthenticateWithCredential } from "firebase/auth";
import type { User } from "firebase/auth";
import { updateAccount, getUserData } from "../utils/databaseHelpers";
import { PreferenceCategoryEnum, AuthenticationFieldEnum } from "../utils/constants";
import AuthenticatePassword from "../components/AuthenticatePassword";
import ErrorState from "../components/ErrorState";
import TextField from "@mui/material/TextField";

const AccountPage: React.FC<RecipeToggleNavBarProps> = ({ navOpen, toggleNav }) => {
  const [userIntolerances, setUserIntolerances] = useState<string[]>([]);
  const [userDiets, setUserDiets] = useState<string[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>()
  const [userEmail, setUserEmail] = useState<string>();
  const [userPassword, setUserPassword] = useState<string>();
  const [loadingData, setLoadingData] = useState(true);
  const [message, setMessage] = useState<string>();


  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUser(user);
        setUserInfo(user);
        setLoadingData(false);
      } else {
        setCurrentUser(null);
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
      const { category, selection } = (event.currentTarget as HTMLButtonElement).dataset
      const setPreferenceList = category === PreferenceCategoryEnum.INTOLERANCES ? setUserIntolerances : setUserDiets;
      const userList = category === PreferenceCategoryEnum.INTOLERANCES ? userIntolerances : userDiets;
      if (selection) {
          if (userList.includes(selection)) {
              setPreferenceList((prev) =>
              prev.filter((item) => item !== selection)
              );
          } else {
              setPreferenceList((prev) => [...prev, selection]);
          }
      }
  }

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { credential } = (event.target as HTMLInputElement).dataset
    const { value } = event.target;
    if (credential === AuthenticationFieldEnum.EMAIL) {
      setUserEmail(value);
    } else if (credential === AuthenticationFieldEnum.PASSWORD) {
      setUserPassword(value);
    }
  };

  const handleAccountSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    event.currentTarget.reset();
    if (!userPassword) {
      setMessage("auth/no-password");
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
              updateEmail(user, userEmail).catch((error) => {
                  setMessage(error.code);
                });
            }
            // then update account in database
            updateAccount({user, userEmail, userIntolerances, userDiets});
            setMessage("success/profile-update")
          }).catch((error) => {
            setMessage(error.code)
            setUserPassword("")
          });
      } catch (error) {
        setMessage("auth/operation-not-allowed")
      }
    }
  };


  if(!currentUser && !loadingData) {
    return (
      <div className="account-page">
        <AppHeader navOpen={navOpen} toggleNav={toggleNav} />
        <p className="not-signed-in">Sign in to edit account details</p>
      </div>
    );
  }

  return (
    <div className="account-page">
      <AppHeader navOpen={navOpen} toggleNav={toggleNav} />
      <div className="account-info">
        <h1>Edit Account Details</h1>
        <div className="account-email">
          <TextField required id={AuthenticationFieldEnum.EMAIL} slotProps={{htmlInput: { 'data-credential': `${AuthenticationFieldEnum.EMAIL}`}}} onChange={handleInputChange} value={userEmail ? userEmail : ""} label="Email" variant="standard" />
        </div>
        <h2>Selected Intolerances</h2>
        <RegistrationPreferenceButtons listName={PreferenceCategoryEnum.INTOLERANCES} listItems={Intolerances} userList={userIntolerances} handleButtonClick={handlePreferenceClick}/>
        <h2>Selected Diets</h2>
        <RegistrationPreferenceButtons listName={PreferenceCategoryEnum.DIETS} listItems={Diets} userList={userDiets} handleButtonClick={handlePreferenceClick}/>
        <AuthenticatePassword handleAccountSubmit={handleAccountSubmit} handleInputChange={handleInputChange} />
        { message && <ErrorState errorMessage={message} /> }
      </div>
    </div>
  );
};

export default AccountPage;
