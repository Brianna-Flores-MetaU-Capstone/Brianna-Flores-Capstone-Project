import { useState } from "react";
import { auth } from "../utils/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router";
import type { GPErrorMessageTypes } from "../utils/types/types";
import { validateUserToken } from "../utils/databaseHelpers";
import AppHeader from "../components/utils/AppHeader";
import ErrorState from "../components/utils/ErrorState";
import AuthForm from "../components/authentication/AuthForm";
import { handleAuthInputChange } from "../utils/utils";
import { Button, Box, Card, Typography } from "@mui/joy";
import { useUser } from "../contexts/UserContext";
import { AuthFormData } from "../classes/authentication/AuthFormData";
import axios from "axios";
const databaseUrl = import.meta.env.VITE_DATABASE_URL;

const LoginPage = () => {
  const [formData, setFormData] = useState<AuthFormData>(new AuthFormData());
  const [message, setMessage] = useState<GPErrorMessageTypes>();
  const navigate = useNavigate();
  const { setUser } = useUser();

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    signInWithEmailAndPassword(auth, formData.getEmail, formData.getPassword)
      .then(async () => {
        const user = auth.currentUser;
        if (user) {
          const userData = await validateUserToken(user);
          if (userData) {
            try {
              const userExtendedData = await axios.get(`${databaseUrl}/me`, {
                withCredentials: true,
              });
              if (userExtendedData.data.id) {
                setUser(userExtendedData.data);
              }
              setMessage({ error: false, message: "Successfully logged in!" });
            } catch (error) {
              setUser(null);
              setMessage({ error: true, message: "Error saving login" });
            }
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
        <Card sx={{ mt: 30, mx: "auto" }}>
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
