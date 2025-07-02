import React from "react";
import type { RecipeToggleNavBar } from "../utils/types";
import AppHeader from "../components/AppHeader";
import RegistrationPreferenceButtons from "../components/RegistrationPreferenceButtons";
import { Intollerances, Diets } from "../utils/enum";
import { useState, useEffect } from "react";
import "../styles/AccountPage.css";
import "../styles/LoginPage.css";

// get user that is currently signed in
// code from firebase.google.com
import { auth } from "../utils/firebase"
import { onAuthStateChanged, updateProfile, updateEmail, reauthenticateWithCredential } from "firebase/auth";
import type { User } from "firebase/auth";

const AccountPage = ({ navOpen, toggleNav }: RecipeToggleNavBar) => {
  const [userIntollerances, setUserIntollerances] = useState<string[]>([]);
  const [userDiets, setUserDiets] = useState<string[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(auth.currentUser)
  const [userEmail, setUserEmail] = useState<string>();

  useEffect(() => {
    if (currentUser) {
      console.log("current user", currentUser)
      // get the users data from database (email, intollerances, diets)
      getUserData(currentUser)
    }
  }, [])

  // when a new user is signed in, update the email, intollerances, and diets
  useEffect(() => {
    if (currentUser) {
      console.log("current user", currentUser)
      // get the users data from database (email, intollerances, diets)
      getUserData(currentUser)
    }
  }, [currentUser])


  const getUserData = async (currentUser: User) => {
    try {
      const userData = await fetch(`http://localhost:3000/account/${currentUser.uid}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })
      if (!userData.ok) {
        throw new Error("Failed to create comment");
      }
      const data = await userData.json();
      console.log(data)
      setUserEmail(data.email)
      setUserIntollerances(data.intollerances)
      setUserDiets(data.diets)
    } catch (error) {
        console.error(error)
    }
  }

//   const auth = getAuth();
    const checkUserSignedIn = () => {
        onAuthStateChanged(auth, (user) => {
          if (user) {
            // User is signed in, see docs for a list of available properties
            // https://firebase.google.com/docs/reference/js/auth.user
            const userSignedIn = auth.currentUser
            setCurrentUser(userSignedIn)
            console.log("current user is", userSignedIn);
          } else {
            // User is signed out
            // ...
            console.log("there is no signed in user");
          }
        });
    }
    // checkUserSignedIn();

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
        const { value } = event.target;
        console.log("user email is", value)
        setUserEmail(value);
    };

    const handleAccountChanges = () => {
        if (auth.currentUser && userEmail) {
            updateEmail(auth.currentUser, userEmail).then(() => {
                // Email updated!
                // ...
                console.log("updated email")
            }).catch((error) => {
                // An error occurred
                // ...
                console.log(error.code)
            });
        } else {
            setUserEmail("Must login to edit email")
        }
    }


  return (
    <div className="account-page">
      <AppHeader navOpen={navOpen} toggleNav={toggleNav} />
        <button onClick={checkUserSignedIn}>check whose signed in</button>
      <div className="account-info">
        <h1>Edit Account Details</h1>
        <div className="account-email">
          <h3>Email</h3>
          <input name="email" id="email" value={userEmail ? userEmail: ""} onChange={handleInputChange}/>
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
        <button type="submit" onClick={handleAccountChanges}>Submit</button>
      </div>
    </div>
  );
};

export default AccountPage;
