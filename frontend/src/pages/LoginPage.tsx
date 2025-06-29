import "../styles/LoginPage.css";
import { useState } from "react";
import { auth } from "../utils/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import type { navigationTypes } from "../utils/types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import NavBar from "../components/NavBar";
import { useNavigate } from "react-router";
import type { formData } from "../utils/types";
import { validateInput } from "../utils/utils";

const LoginPage = ({ navOpen, toggleNav }: navigationTypes) => {
  const [formData, setFormData] = useState<formData>({
    username: "",
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

    signInWithEmailAndPassword(auth, formData.username, formData.password)
      .then((userCredential) => {
        // Signed in
        const user = userCredential.user;
        setMessage({ type: "success", text: "Login successful!" });
        navigate("/"); // go back to homepage
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log("error ", errorCode, errorMessage);
        setMessage({ type: "error", text: "Login failed." });
      });
  }
  return (
    <div>
      <button onClick={toggleNav}>
        <FontAwesomeIcon icon={faBars} className="nav-icon" />
      </button>
      <NavBar toggleNav={toggleNav} navOpen={navOpen} />{" "}
      <form onSubmit={handleSubmit}>
        <label htmlFor="username">Email</label>
        <input
          type="text"
          name="username"
          value={formData.username}
          onChange={handleChange}
          required
        />
        <label htmlFor="password">Password</label>
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          required
        />
        <button type="submit">Login!</button>
      </form>
      {message && <p className={`message ${message.type}`}>{message.text}</p>}
      <p>New User?</p>
      <button onClick={() => navigate("/signup")}>
        Register for an Account!
      </button>
    </div>
  );
};

export default LoginPage;
