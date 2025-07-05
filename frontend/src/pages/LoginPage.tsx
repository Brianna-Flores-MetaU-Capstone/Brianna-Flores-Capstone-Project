import "../styles/LoginPage.css";
import { useState } from "react";
import { auth } from "../utils/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router";
import type { GPAuthFormDataTypes, GPToggleNavBarProps, GPErrorMessageTypes } from "../utils/types";
import "../styles/LoginPage.css";
import AppHeader from "../components/AppHeader";
import ErrorState from "../components/ErrorState";
import AuthForm from "../components/AuthForm";
import { handleAuthInputChange } from "../utils/utils";
import Button from "@mui/material/Button";

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
      .then(() => {
        setMessage({error: false, message: "Successfully logged in!"})
      })
      .catch((error) => {
        setMessage({error: true, message: error.code});
      });
  }
  return (
    <div className="login-page">
      <AppHeader navOpen={navOpen} toggleNav={toggleNav} />
      <section className="login-page">
        <div className="login-content">
          <AuthForm
            handleLoginSubmit={handleSubmit}
            handleAuthInputChange={(event) =>
              handleAuthInputChange(event, setFormData)
            }
            formData={formData}
          />
          {message && <ErrorState error={message.error} message={message.message} />}
          <div className="new-user-section">
            <p>New User?</p>
            <Button className="submit-auth" onClick={() => navigate("/signup")}>
              Register for an Account!
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LoginPage;
