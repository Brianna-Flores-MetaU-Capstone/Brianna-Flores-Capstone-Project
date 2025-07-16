import { useState } from "react";
import { auth } from "../utils/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router";
import type { GPAuthFormDataTypes, GPErrorMessageTypes } from "../utils/types";
import { validateUserToken } from "../utils/databaseHelpers";
import AppHeader from "../components/AppHeader";
import ErrorState from "../components/ErrorState";
import AuthForm from "../components/AuthForm";
import { handleAuthInputChange } from "../utils/utils";
import { Button, Box, Card, Typography } from "@mui/joy";
import { useUser } from "../contexts/UserContext";


const LoginPage = () => {
  const [formData, setFormData] = useState<GPAuthFormDataTypes>({
    email: "",
    password: "",
  });
  const [message, setMessage] = useState<GPErrorMessageTypes>();
  const navigate = useNavigate();
  const { setUser } = useUser();

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    signInWithEmailAndPassword(auth, formData.email, formData.password)
      .then(async () => {
        const user = auth.currentUser;
        if (user) {
          const userData = await validateUserToken(user);
          if (userData) {
            setUser(userData);
            setMessage({ error: false, message: "Successfully logged in!" });
          }
        } else {
          setMessage({ error: true, message: "Account not found" });
        }
      })
      .catch((error) => {
        setMessage({ error: true, message: error.code });
      });
  }

  return (
    <Box>
      <AppHeader />
      <Box>
        <Card
          sx={{ mt: 30, mx: "auto" }}
        >
          <AuthForm
            handleLoginSubmit={handleSubmit}
            handleAuthInputChange={(event) =>
              handleAuthInputChange(event, setFormData)
            }
            formData={formData}
          />
          {message && (
            <ErrorState error={message.error} message={message.message} />
          )}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography>New User?</Typography>
            <Button onClick={() => navigate("/signup")}>
              Register for an Account!
            </Button>
          </Box>
        </Card>
      </Box>
    </Box>
  );
};

export default LoginPage;
