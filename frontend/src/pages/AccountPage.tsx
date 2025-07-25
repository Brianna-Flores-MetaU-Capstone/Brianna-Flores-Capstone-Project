import React from "react";
import AppHeader from "../components/utils/AppHeader";
import RegistrationPreferenceButtons from "../components/authentication/RegistrationPreferenceButtons";
import type { GPErrorMessageTypes } from "../utils/types/types";
import { Intolerances, Diets } from "../utils/enum";
import { useState, useEffect } from "react";
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
import AuthenticatePassword from "../components/authentication/AuthenticatePassword";
import ErrorState from "../components/utils/ErrorState";
import {
  Button,
  Box,
  Card,
  Input,
  FormControl,
  FormHelperText,
  FormLabel,
  Typography,
} from "@mui/joy";
import InfoOutlined from "@mui/icons-material/InfoOutlined";
import { useUser } from "../contexts/UserContext";
import axios from "axios";
const databaseUrl = import.meta.env.VITE_DATABASE_URL;

const GPAccountPageStyle = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  mt: 10,
  mx: "auto",
};

const AccountPage = () => {
  const [userIntolerances, setUserIntolerances] = useState<string[]>([]);
  const [userDiets, setUserDiets] = useState<string[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>();
  const [userEmail, setUserEmail] = useState<string>();
  const [userPassword, setUserPassword] = useState<string>();
  const [loadingData, setLoadingData] = useState(true);
  const [message, setMessage] = useState<GPErrorMessageTypes>();
  const [emailInputError, setEmailInputError] = useState(false);
  const [passwordInuptError, setPasswordInputError] = useState(false);
  const { setUser } = useUser();

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
    event: React.MouseEvent<HTMLButtonElement>,
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
      setEmailInputError(value === "");
      setUserEmail(value);
    } else if (credential === AuthenticationFieldEnum.PASSWORD) {
      setPasswordInputError(value === "");
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
          userPassword,
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
        },
      );
      setUser(null);
      setMessage({ error: false, message: "Successfully logged out" });
    } catch (error) {
      setMessage({ error: true, message: "Logout failed" });
    }
  };

  if (!currentUser && !loadingData) {
    return (
      <Box>
        <AppHeader />
        {message && (
          <ErrorState error={message.error} message={message.message} />
        )}
      </Box>
    );
  }

  return (
    <Box>
      <AppHeader />
      <Card sx={GPAccountPageStyle}>
        <Typography level="h2">Edit Account Details</Typography>
        <FormControl error={emailInputError}>
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
          />
          {emailInputError && (
            <FormHelperText>
              <InfoOutlined />
              Must enter an email
            </FormHelperText>
          )}
        </FormControl>
        <Typography level="h4">Selected Intolerances</Typography>
        <RegistrationPreferenceButtons
          listName={PreferenceCategoryEnum.INTOLERANCES}
          listItems={Intolerances}
          userList={userIntolerances}
          handleButtonClick={handlePreferenceClick}
        />
        <Typography level="h4">Selected Diets</Typography>
        <RegistrationPreferenceButtons
          listName={PreferenceCategoryEnum.DIETS}
          listItems={Diets}
          userList={userDiets}
          handleButtonClick={handlePreferenceClick}
        />
        <AuthenticatePassword
          handleAccountSubmit={handleAccountSubmit}
          handleInputChange={handleInputChange}
          passwordInputError={passwordInuptError}
        />
        {message && (
          <ErrorState error={message.error} message={message.message} />
        )}
        <Button onClick={handleLogout}>Logout</Button>
      </Card>
    </Box>
  );
};

export default AccountPage;
