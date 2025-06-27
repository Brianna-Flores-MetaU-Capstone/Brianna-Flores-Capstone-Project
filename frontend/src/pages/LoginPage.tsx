import "../styles/LoginPage.css";
import { useState } from "react";
// import { auth } from "../../../backend/index";
// import { signInWithEmailAndPassword } from "firebase/auth";
import type { navigationTypes } from "../utils/types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import NavBar from "../components/NavBar";
import { useNavigate } from "react-router";

const LoginPage = ({ navOpen, toggleNav }: navigationTypes) => {
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [message, setMessage] = useState({ type: "", text: "" });
  const navigate = useNavigate();

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

//   function handleSubmit(event: React.FormEvent) {
//     event.preventDefault();
//     // console.log("Signup form submitted!", formData);
//     // check password is valid length
//     if (!formData.username || !formData.password) {
//       throw new Error("Username and password are required");
//     }

//     signInWithEmailAndPassword(auth, formData.username, formData.password)
//       .then((userCredential) => {
//         // Signed in
//         const user = userCredential.user;
//         setMessage({ type: "success", text: "Login successful!" });
//         navigate("/"); // go back to homepage
//       })
//       .catch((error) => {
//         const errorCode = error.code;
//         const errorMessage = error.message;
//         console.log("error ", errorCode, errorMessage);
//         setMessage({ type: "error", text: "Login failed." });
//       });
//   }
  return (
    <div>
      <button onClick={toggleNav}>
        <FontAwesomeIcon icon={faBars} className="nav-icon" />
      </button>
      {navOpen && <NavBar toggleNav={toggleNav} />}
      {/* <form onSubmit={handleSubmit}> */}
      <form>
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
      <p>New User?</p>
      <button onClick={() => navigate("/signup")}>Register for an Account!</button>
      {message && <p className={`message ${message.type}`}>{message.text}</p>}
    </div>
  );
};

export default LoginPage;
