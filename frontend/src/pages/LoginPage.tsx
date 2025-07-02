import "../styles/LoginPage.css";
import { useState } from "react";
import { auth } from "../utils/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router";
import type { RecipeAuthFormData, RecipeToggleNavBar } from "../utils/types";
import "../styles/LoginPage.css";
import LoginForm from "../components/LoginForm";
import AppHeader from "../components/AppHeader";
import ErrorState from "../components/ErrorState";

const LoginPage = ({ navOpen, toggleNav }: RecipeToggleNavBar) => {
  const [formData, setFormData] = useState<RecipeAuthFormData>({
    email: "",
    password: "",
  });
  const [message, setMessage] = useState<string>();
  const navigate = useNavigate();

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    signInWithEmailAndPassword(auth, formData.email, formData.password)
      .then((userCredential) => {
        // Signed in
        navigate("/"); // go back to homepage
      })
      .catch((error) => {
        setMessage(error.code);
        console.log(error.code)
      });
  }
  return (
    <div className="login-page">
      <AppHeader navOpen={navOpen} toggleNav={toggleNav}/>
      <section className="login-page">
        <div className="login-content">
          <LoginForm handleSubmit={handleSubmit} handleChange={handleChange} formData={formData}/>
          {message && (
            <ErrorState errorMessage={message} />
          )}
          <div className="new-user-section">
            <p>New User?</p>
            <button className="submit-auth" onClick={() => navigate("/signup")}>
              Register for an Account!
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LoginPage;
