import { useState } from "react";
import { auth } from "../../../backend/index"
import { createUserWithEmailAndPassword } from "firebase/auth";
import type {navigationTypes} from '../utils/types'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import NavBar from "../components/NavBar";
import { useNavigate } from "react-router";


const SignupForm = ( {navOpen, toggleNav} : navigationTypes) => {
    const [formData, setFormData] = useState({ username: "", password: "" });
    const [message, setMessage] = useState({ type: "", text: "" });
    const navigate = useNavigate();


    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    }

    function handleSubmit(event: React.FormEvent) {
        event.preventDefault();
        // console.log("Signup form submitted!", formData);
        // check password is valid length
        if (!formData.username || !formData.password) {
            throw new Error("Username and password are required")
            setMessage({ type: "error", text: "Username and password are required" });

        }

        if (formData.password.length < 8) {
            setMessage({ type: "error", text: "Password must be at least 8 characters long" });
            throw new Error("Password must be at least 8 characters long")
        }
        createUserWithEmailAndPassword(auth, formData.username, formData.password)
        .then((userCredential) => {
            // Signed up 
            const user = userCredential.user;
            console.log("created user ", user)
            setMessage({ type: "success", text: "Registration successful!" });
            // ...
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.log("error ", errorCode, errorMessage)
            setMessage({ type: "error", text: "error during registration"})
            // ..
        });
    }
    return (
        <div>
            <button onClick={toggleNav}>
                <FontAwesomeIcon
                icon={faBars}
                className="nav-icon"
                />
            </button>
            {navOpen && <NavBar toggleNav={toggleNav} />}
            <form onSubmit={handleSubmit}>
                <label htmlFor="username">Email</label>
                <input type="text" name="username" value={formData.username} onChange={handleChange} />
                <label htmlFor="password">Password</label>
                <input type="password" name="password" value={formData.password} onChange={handleChange} />
                <p>Password must be at least 8 characters</p>
                <button type="submit">Register!</button>
            </form>
            {message && <p className={`message ${message.type}`}>{message.text}</p>}
        </div>
    )
}

export default SignupForm;