import { useState } from "react";
import { auth } from "../utils/firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import type {
  GPAccountInfoTypes,
  GPAuthFormDataTypes,
  GPToggleNavBarProps,
  GPErrorMessageTypes,
} from "../utils/types";
import { handleNewUser } from "../utils/databaseHelpers";
import "../styles/LoginPage.css";
import AuthForm from "../components/AuthForm";
import AppHeader from "../components/AppHeader";
import ErrorState from "../components/ErrorState";
import { handleAuthInputChange } from "../utils/utils";
import Box from "@mui/material/Box";

const SignupForm: React.FC<GPToggleNavBarProps> = ({ navOpen, toggleNav }) => {
  const [formData, setFormData] = useState<GPAuthFormDataTypes>({
    email: "",
    password: "",
  });
  const [message, setMessage] = useState<GPErrorMessageTypes>();

  function handleSubmit({
    userIntolerances,
    userDiets,
  }: {
    userIntolerances: string[];
    userDiets: string[];
  }) {
    createUserWithEmailAndPassword(auth, formData.email, formData.password)
      .then((userCredential) => {
        // Signed up
        const user = userCredential.user;
        const newUser: GPAccountInfoTypes = {
          firebaseId: user.uid ? user.uid : "",
          email: user.email ? user.email : "",
          intolerances: userIntolerances,
          diets: userDiets,
        };
        handleNewUser({ newUser, setMessage });
        setMessage({
          error: false,
          message: "Registration successful!",
        });
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
