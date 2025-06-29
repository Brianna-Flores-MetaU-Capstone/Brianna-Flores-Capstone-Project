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
import "../styles/LoginPage.css";

const LoginPage = ({ navOpen, toggleNav }: navigationTypes) => {
  const [formData, setFormData] = useState<formData>({
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
      <section className="homepage-header">
        <header>
          <h1>Grocery Buddy *insert better title lol*</h1>
        </header><button className="nav-button" onClick={toggleNav}>
          <FontAwesomeIcon
            icon={faBars}
            className="nav-icon"
          />
        </button>
        <NavBar toggleNav={toggleNav} navOpen={navOpen} />
      </section>
      <section className="login-page">
        <div className="login-content">
          <form className="login-info" onSubmit={handleSubmit}>
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
            <button type="submit">Login!</button>
          </form>
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
