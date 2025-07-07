import { useState } from "react";
import { auth } from "../utils/firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import type {
  GPAccountInfoTypes,
  GPAuthFormDataTypes,
  GPToggleNavBarProps,
  GPErrorMessageTypes,
} from "../utils/types";
import { handleNewUser, validateUserToken } from "../utils/databaseHelpers";
import "../styles/LoginPage.css";
import AuthForm from "../components/AuthForm";
import AppHeader from "../components/AppHeader";
import ErrorState from "../components/ErrorState";
import { handleAuthInputChange } from "../utils/utils";
import Box from "@mui/material/Box";
import { useUser } from "../contexts/UserContext";

const SignupForm: React.FC<GPToggleNavBarProps> = ({ navOpen, toggleNav }) => {
  const [formData, setFormData] = useState<GPAuthFormDataTypes>({
    email: "",
    password: "",
  });
  const [message, setMessage] = useState<GPErrorMessageTypes>();
  const { setUser } = useUser(); // Access global user state


  function handleSubmit({
    userIntolerances,
    userDiets,
  }: {
    userIntolerances: string[];
    userDiets: string[];
  }) {
    createUserWithEmailAndPassword(auth, formData.email, formData.password)
      .then(async (userCredential) => {
        // Signed up
        const user = userCredential.user;
        const newUser: GPAccountInfoTypes = {
          firebaseId: user.uid ? user.uid : "",
          email: user.email ? user.email : "",
          intolerances: userIntolerances,
          diets: userDiets,
        };
        const newUserData = await handleNewUser({ newUser, setMessage });
        const response = await validateUserToken(user)
        if (response) {
          setMessage({
            error: false,
            message: "Registration successful!",
          });
          setUser(newUserData);
        }
      })
      .catch((error) => {
        setMessage({
          error: true,
          message: error.code,
        });
      });
  }

  return (
    <div className="login-page signup-page">
      <AppHeader navOpen={navOpen} toggleNav={toggleNav} />
      <Box className="login-content">
        <AuthForm
          handleRegistrationSubmit={handleSubmit}
          handleAuthInputChange={(event) =>
            handleAuthInputChange(event, setFormData)
          }
          formData={formData}
        />
        {message && (
          <ErrorState error={message.error} message={message.message} />
        )}
      </Box>
    </div>
  );
};

export default SignupForm;
