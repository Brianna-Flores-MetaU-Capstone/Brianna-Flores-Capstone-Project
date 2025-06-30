import "../styles/LoginPage.css";
import { useState } from "react";
import { auth } from "../utils/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import type { RecipeToggleNavBar } from "../utils/types";
import { useNavigate } from "react-router";
import type { RecipeAuthFormData } from "../utils/types";
import { validateInput } from "../utils/utils";
import "../styles/LoginPage.css";
import LoginRegisterForm from "../components/LoginRegisterForm";
import AppHeader from "../components/AppHeader";

const LoginPage = ({ navOpen, toggleNav }: RecipeToggleNavBar) => {
  const [formData, setFormData] = useState<RecipeAuthFormData>({
    email: "",
    password: "",
  });
  const [message, setMessage] = useState({ type: "", text: "" });
  const navigate = useNavigate();

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    const valid = validateInput(formData);
    if (valid.type === "error" && valid.text) {
      setMessage(valid);
      throw new Error(valid.text);
    }

    signInWithEmailAndPassword(auth, formData.email, formData.password)
      .then((userCredential) => {
        // Signed in
        const user = userCredential.user;
        setMessage({ type: "success", text: "Login successful!" });
        navigate("/"); // go back to homepage
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        setMessage({ type: "error", text: "Login failed." });
      });
  }
  return (
    <div className="login-page">
      <AppHeader navOpen={navOpen} toggleNav={toggleNav}/>
      <section className="login-page">
        <div className="login-content">
          <LoginRegisterForm handleSubmit={handleSubmit} handleChange={handleChange} formData={formData}/>
          {message && (
            <p className={`message ${message.type}`}>{message.text}</p>
          )}
          <div className="new-user-section">
            <p>New User?</p>
            <button onClick={() => navigate("/signup")}>
              Register for an Account!
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LoginPage;
