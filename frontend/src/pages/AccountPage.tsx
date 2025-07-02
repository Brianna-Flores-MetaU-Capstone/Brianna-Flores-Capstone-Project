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
// import { EmailAuthProvider } from "firebase/auth/web-extension";

const AccountPage = ({ navOpen, toggleNav }: RecipeToggleNavBar) => {
  const [userIntollerances, setUserIntollerances] = useState<string[]>([]);
  const [userDiets, setUserDiets] = useState<string[]>([]);
  // const [currentUser, setCurrentUser] = useState<User | null>()
  const [userEmail, setUserEmail] = useState<string>();
  const [userPassword, setUserPassword] = useState<string>();
  const [userSignedIn, setUserSignedIn] = useState(false);

  useEffect(() => {
    // const user = auth.currentUser;
    onAuthStateChanged(auth, (user) => {
      if (user) {
        console.log("yay we signed in!", user);
        const uid = user.uid;
        setUserSignedIn(true);
        // get the users data from database (email, intollerances, diets)
        getUserData(user);
      } else {
        console.log("no one singed in so sad ;-;");
        setUserSignedIn(false);
      }
    });
  }, []);

  const getUserData = async (user: User) => {
    try {
      const userData = await fetch(
        `http://localhost:3000/account/${user.uid}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (!userData.ok) {
        throw new Error("Failed to get user data");
      }
      const data = await userData.json();
      console.log(data);
      setUserEmail(data.email);
      setUserIntollerances(data.intollerances);
      setUserDiets(data.diets);
    } catch (error) {
      console.error(error);
    }
  };

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
    if (user && user.email) {
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
            updateAccount();
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

  const updateAccount = async () => {
    const updatedUser = await fetch(
      `http://localhost:3000/account/${auth.currentUser?.uid}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: userEmail,
          intollerances: userIntollerances,
          diets: userDiets,
        }),
      }
    );
    if (!updatedUser.ok) {
      throw new Error("Failed to update user");
    }
    const data = await updatedUser.json();
    console.log(data);
    return data;
  };


  if (!userSignedIn) {
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
