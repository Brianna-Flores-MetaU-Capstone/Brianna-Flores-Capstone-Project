import "../styles/LoginPage.css";
import { useState } from "react";
import { auth } from "../utils/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router";
import type {
  GPAuthFormDataTypes,
  GPToggleNavBarProps,
  GPErrorMessageTypes,
} from "../utils/types";
import { validateUserToken } from "../utils/databaseHelpers";
import "../styles/LoginPage.css";
import AppHeader from "../components/AppHeader";
import ErrorState from "../components/ErrorState";
import AuthForm from "../components/AuthForm";
import { handleAuthInputChange } from "../utils/utils";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
const databaseUrl = import.meta.env.VITE_DATABASE_URL;

const LoginPage: React.FC<GPToggleNavBarProps> = ({ navOpen, toggleNav }) => {
  const [formData, setFormData] = useState<GPAuthFormDataTypes>({
    email: "",
    password: "",
  });
  const [message, setMessage] = useState<GPErrorMessageTypes>();
  const navigate = useNavigate();

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    signInWithEmailAndPassword(auth, formData.email, formData.password)
      .then(async () => {
        const user = auth.currentUser;
        if (user) {
          const response = await validateUserToken(user);
          if (response) {
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

  const checkSession = async () => {
    const response = await fetch(`${databaseUrl}/me`, {
      method: "GET",
      credentials: "include",
    });
    const data = await response.json();
  };

  return (
    <div className="login-page">
      <AppHeader navOpen={navOpen} toggleNav={toggleNav} />
      <section className="login-page">
        <Box className="login-content">
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
          <div className="new-user-section">
            <p>New User?</p>
            <Button className="submit-auth" onClick={() => navigate("/signup")}>
              Register for an Account!
            </Button>
          </div>
        </Box>
      </section>
    </div>
  );
};

export default LoginPage;
