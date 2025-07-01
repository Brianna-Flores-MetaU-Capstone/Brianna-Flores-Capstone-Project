import React from "react";
import type { RecipeToggleNavBar } from "../utils/types";
import AppHeader from "../components/AppHeader";
import RegistrationPreferenceButtons from "../components/RegistrationPreferenceButtons";
import { Intollerances, Diets } from "../utils/enum";
import { useState } from "react";
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
  const [userEmail, setUserEmail] = useState(currentUser?.email);

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

    const handleChangeEmail = () => {
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



    // const reauthenticateUser = () => {
    //     const user = auth.currentUser;
    //     const credential = promptForCredentials();

    //     if (user) {
    //         reauthenticateWithCredential(user, credential).then(() => {
    //         // User re-authenticated.
    //         }).catch((error) => {
    //         // An error ocurred
    //         // ...
    //         });
    //     }

    // }

  return (
    <div className="account-page">
      <AppHeader navOpen={navOpen} toggleNav={toggleNav} />
        <button onClick={checkUserSignedIn}>check whose signed in</button>
      <div className="account-info">
        <h1>Edit Account Details</h1>
        <div className="account-email">
          <h3>Email</h3>
          <input name="email" id="email" value={userEmail ? userEmail: ""} onChange={handleInputChange}/>
            {/* <input name="name" id="ingredient-name" value={newIngredientData?.name} onChange={handleInputChange} required/> */}

          <button type="submit" onClick={handleChangeEmail}>Submit</button>
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
      </div>
    </div>
  );
};

export default AccountPage;
