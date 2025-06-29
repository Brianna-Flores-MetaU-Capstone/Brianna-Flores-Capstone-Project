import { useState } from "react";
import { auth } from "../utils/firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import type { navigationTypes } from "../utils/types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import NavBar from "../components/NavBar";
import { useNavigate } from "react-router";
import type { messageTypes, newUserType, formDataType } from "../utils/types";
import { validateInput, handleNewUser } from "../utils/utils";
import "../styles/LoginPage.css";
import LoginRegisterForm from "../components/LoginRegisterForm";

const SignupForm = ({ navOpen, toggleNav }: navigationTypes) => {
  const [formData, setFormData] = useState<formDataType>({
    email: "",
    password: "",
  });
  const [message, setMessage] = useState<messageTypes>();
  const navigate = useNavigate();
  const [success, setSuccess] = useState(false);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    const valid = validateInput(formData);
    if (valid.type === "error" && valid.text) {
      setSuccess(false);
      setMessage(valid);
      throw new Error(valid.text);
    }
    createUserWithEmailAndPassword(auth, formData.email, formData.password)
      .then((userCredential) => {
        // Signed up
        const user = userCredential.user;
        setMessage({ type: "success", text: "Registration successful!" });
        setSuccess(true);
        const newUser: newUserType = {
          firebaseId: user.uid ? user.uid : "",
          email: user.email ? user.email : "",
        };
        handleNewUser(newUser);
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log("error ", errorCode, errorMessage);
        setMessage({ type: "error", text: "Email already in use or invalid!" });
        setSuccess(false);
      });
  }

  return (
    <div className="login-page">
      <section className="homepage-header">
        <header>
          <h1>Grocery Buddy *insert better title lol*</h1>
        </header>
        <button className="nav-button" onClick={toggleNav}>
          <FontAwesomeIcon icon={faBars} className="nav-icon" />
        </button>
        <NavBar toggleNav={toggleNav} navOpen={navOpen} />
      </section>
      <section className="login-content">
         <LoginRegisterForm handleSubmit={handleSubmit} handleChange={handleChange} formData={formData}/>
        {message && <p className={`message ${message.type}`}>{message.text}</p>}
        {success && (
          <button onClick={() => navigate("/login")}>Take me to login!</button>
        )}
      </section>
    </div>
  );
};

export default SignupForm;
