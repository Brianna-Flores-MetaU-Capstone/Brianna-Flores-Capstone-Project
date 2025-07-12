import React from "react";
import AppHeader from "../components/AppHeader";
import RegistrationPreferenceButtons from "../components/RegistrationPreferenceButtons";
import type { GPToggleNavBarProps, GPErrorMessageTypes } from "../utils/types";
import { Intolerances, Diets } from "../utils/enum";
import { useState, useEffect } from "react";
import "../styles/AccountPage.css";
import "../styles/LoginPage.css";
import { auth } from "../utils/firebase";
import {
  onAuthStateChanged,
  EmailAuthProvider,
  updateEmail,
  reauthenticateWithCredential,
  signOut,
} from "firebase/auth";
import type { User } from "firebase/auth";
import { updateAccount, getUserData } from "../utils/databaseHelpers";
import {
  PreferenceCategoryEnum,
  AuthenticationFieldEnum,
} from "../utils/constants";
import AuthenticatePassword from "../components/AuthenticatePassword";
import ErrorState from "../components/ErrorState";
import { Button, Input, FormControl, FormLabel } from "@mui/joy";
import { useUser } from "../contexts/UserContext";
import axios from "axios";
const databaseUrl = import.meta.env.VITE_DATABASE_URL;

const AccountPage: React.FC<GPToggleNavBarProps> = ({ navOpen, toggleNav }) => {
  const [userIntolerances, setUserIntolerances] = useState<string[]>([]);
  const [userDiets, setUserDiets] = useState<string[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>();
  const [userEmail, setUserEmail] = useState<string>();
  const [userPassword, setUserPassword] = useState<string>();
  const [loadingData, setLoadingData] = useState(true);
  const [message, setMessage] = useState<GPErrorMessageTypes>();
  const { setUser } = useUser();

  // TODO Implement useReducer to handle user data

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
    const userData = await getUserData({ user, setMessage });
    if (userData) {
      setUserEmail(userData.userEmail);
      setUserIntolerances(userData.userIntolerances);
      setUserDiets(userData.userDiets);
    }
  };

  const handlePreferenceClick = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    const { category, selection } = (event.currentTarget as HTMLButtonElement)
      .dataset;
    const setPreferenceList =
      category === PreferenceCategoryEnum.INTOLERANCES
        ? setUserIntolerances
        : setUserDiets;
    const userList =
      category === PreferenceCategoryEnum.INTOLERANCES
        ? userIntolerances
        : userDiets;
    if (selection) {
      if (userList.includes(selection)) {
        setPreferenceList((prev) => prev.filter((item) => item !== selection));
      } else {
        setPreferenceList((prev) => [...prev, selection]);
      }
    }
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { credential } = (event.target as HTMLInputElement).dataset;
    const { value } = event.target;
    if (credential === AuthenticationFieldEnum.EMAIL) {
      setUserEmail(value);
    } else if (credential === AuthenticationFieldEnum.PASSWORD) {
      setUserPassword(value);
    }
  };

  const handleAccountSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    event.currentTarget.reset();
    if (!userPassword) {
      setMessage({ error: true, message: "auth/no-password" });
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
        reauthenticateWithCredential(user, credential)
          .then(() => {
            // if the users email was changed, update on firebase side too
            if (user.email && userEmail && user.email !== userEmail) {
              updateEmail(user, userEmail).catch((error) => {
                setMessage({ error: true, message: error.code });
              });
            }
            updateAccount({
              user,
              userEmail,
              userIntolerances,
              userDiets,
              setMessage,
            });
            setMessage({ error: false, message: "success/profile-update" });
          })
          .catch((error) => {
            setMessage({ error: true, message: error.code });
            setUserPassword("");
          });
      } catch (error) {
        setMessage({ error: true, message: "auth/operation-not-allowed" });
      }
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      await axios.post(
        `${databaseUrl}/logout`,
        {},
        {
          withCredentials: true,
        }
      );
      setUser(null);
      setMessage({ error: false, message: "Successfully logged out" });
    } catch (error) {
      setMessage({ error: true, message: "Logout failed" });
    }
  };

  if (!currentUser && !loadingData) {
    return (
      <div className="account-page">
        <AppHeader navOpen={navOpen} toggleNav={toggleNav} />
        {message && (
          <ErrorState error={message.error} message={message.message} />
        )}
      </div>
    );
  }

  return (
    <div className="account-page">
      <AppHeader navOpen={navOpen} toggleNav={toggleNav} />
      <div className="account-info">
        <h1>Edit Account Details</h1>
        <div className="account-email">
          <FormControl>
            <FormLabel>Email</FormLabel>
            <Input
              required
              id={AuthenticationFieldEnum.EMAIL}
              slotProps={{
                input: {
                  "data-credential": `${AuthenticationFieldEnum.EMAIL}`,
                },
              }}
              onChange={handleInputChange}
              value={userEmail ? userEmail : ""}
              variant="plain"
            />
          </FormControl>
        </div>
        <h2>Selected Intolerances</h2>
        <RegistrationPreferenceButtons
          listName={PreferenceCategoryEnum.INTOLERANCES}
          listItems={Intolerances}
          userList={userIntolerances}
          handleButtonClick={handlePreferenceClick}
        />
        <h2>Selected Diets</h2>
        <RegistrationPreferenceButtons
          listName={PreferenceCategoryEnum.DIETS}
          listItems={Diets}
          userList={userDiets}
          handleButtonClick={handlePreferenceClick}
        />
        <AuthenticatePassword
          handleAccountSubmit={handleAccountSubmit}
          handleInputChange={handleInputChange}
        />
        {message && (
          <ErrorState error={message.error} message={message.message} />
        )}
        <Button onClick={handleLogout}>Logout</Button>
      </div>
    </div>
  );
};

export default AccountPage;
