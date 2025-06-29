import { useState } from "react";
import { auth } from "../utils/firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import type { navigationTypes } from "../utils/types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import NavBar from "../components/NavBar";
import { useNavigate } from "react-router";
import type { messageTypes, newUserType, formData } from "../utils/types";
import { validateInput, handleNewUser } from "../utils/utils";

const SignupForm = ({ navOpen, toggleNav }: navigationTypes) => {
  const [formData, setFormData] = useState<formData>({
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
    <div>
      <button onClick={toggleNav}>
        <FontAwesomeIcon icon={faBars} className="nav-icon" />
      </button>
      <NavBar toggleNav={toggleNav} navOpen={navOpen} />{" "}
      <form onSubmit={handleSubmit}>
        <label htmlFor="email">Email</label>
        <input
          id="email"
          type="text"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <label htmlFor="password">Password</label>
        <input
          id="password"
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          required
        />
        <button type="submit">Register!</button>
      </form>
      {message && <p className={`message ${message.type}`}>{message.text}</p>}
      {success && (
        <button onClick={() => navigate("/login")}>Take me to login!</button>
      )}
    </div>
  );
};

export default SignupForm;
