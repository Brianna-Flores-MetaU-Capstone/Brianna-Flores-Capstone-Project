import "../styles/LoginPage.css";
import { useState } from "react";
import { auth } from "../utils/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router";
import type { RecipeAuthFormData, RecipeToggleNavBarProps } from "../utils/types";
import "../styles/LoginPage.css";
import AppHeader from "../components/AppHeader";
import ErrorState from "../components/ErrorState";
import AuthForm from "../components/AuthForm";
import { handleAuthInputChange } from "../utils/utils";
import Button from "@mui/material/Button";

const LoginPage: React.FC<RecipeToggleNavBarProps> = ({ navOpen, toggleNav }) => {
  const [formData, setFormData] = useState<RecipeAuthFormData>({
    email: "",
    password: "",
  });
  const [message, setMessage] = useState<string>();
  const navigate = useNavigate();

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    signInWithEmailAndPassword(auth, formData.email, formData.password)
      .then(() => {
        navigate("/");
      })
      .catch((error) => {
        setMessage(error.code);
      });
  }
  return (
    <div className="login-page">
      <AppHeader navOpen={navOpen} toggleNav={toggleNav}/>
      <section className="login-page">
        <div className="login-content">
          <AuthForm handleLoginSubmit={handleSubmit} handleAuthInputChange={(event) => handleAuthInputChange(event, setFormData)} formData={formData} />
          {message && (
            <ErrorState errorMessage={message} />
          )}
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
