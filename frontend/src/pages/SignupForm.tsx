import { useState } from "react";
import { auth } from "../utils/firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import type {
  GPAccountInfoTypes,
  GPErrorMessageTypes,
} from "../utils/types";
import { handleNewUser, validateUserToken } from "../utils/databaseHelpers";
import AuthForm from "../components/authentication/AuthForm";
import AppHeader from "../components/utils/AppHeader";
import ErrorState from "../components/utils/ErrorState";
import { handleAuthInputChange } from "../utils/utils";
import { Box, Card } from "@mui/joy";
import { useUser } from "../contexts/UserContext";
import { AuthFormData } from "../classes/authentication/AuthFormData";

const SignupForm = () => {
  const [formData, setFormData] = useState<AuthFormData>(new AuthFormData());
  const [message, setMessage] = useState<GPErrorMessageTypes>();
  const { setUser } = useUser();

  function handleSubmit({
    userIntolerances,
    userDiets,
  }: {
    userIntolerances: string[];
    userDiets: string[];
  }) {
    createUserWithEmailAndPassword(auth, formData.getEmail, formData.getPassword)
      .then(async (userCredential) => {
        const user = userCredential.user;
        if (!user.uid || !user.email) {
          setMessage({
            error: true,
            message: "Unable to create account, missing required information",
          });
          return;
        }

        const newUser: GPAccountInfoTypes = {
          firebaseId: user.uid,
          email: user.email,
          intolerances: userIntolerances,
          diets: userDiets,
        };
        const newUserData = await handleNewUser({ newUser, setMessage });
        const response = await validateUserToken(user);
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
    <Box>
      <AppHeader />
      <Card sx={{ mt: 20, mx: "auto" }}>
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
      </Card>
    </Box>
  );
};

export default SignupForm;
