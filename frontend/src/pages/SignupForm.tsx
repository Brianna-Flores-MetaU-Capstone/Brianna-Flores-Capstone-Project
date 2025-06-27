import { useState } from "react";
import { auth } from "../utils/firebase"
import { createUserWithEmailAndPassword } from "firebase/auth";
import type {navigationTypes} from '../utils/types'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import NavBar from "../components/NavBar";
import { useNavigate } from "react-router";
import type { messageTypes, newUserType } from "../utils/types";
// import { validateInput } from "../utils/utils"


const SignupForm = ( {navOpen, toggleNav} : navigationTypes) => {
    const [formData, setFormData] = useState({ username: "", password: "" });
    const [message, setMessage] = useState<messageTypes>();
    const navigate = useNavigate();
    const [success, setSuccess] = useState(false)

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    }

    const handleNewUser = async (newUser: newUserType) => {
       try {
           const response = await fetch("http://localhost:3000/signup", {
               method: "POST",
               headers: {
                   "Content-Type": "application/json"
               },
               body: JSON.stringify(newUser)
               }
           )
           if (!response.ok) {
               throw new Error("Failed to create user")
           }
           const data = await response.json();
           console.log("successfully created a user: ", data)
       } catch (error) {
           console.error (error)
       }
   }


    function handleSubmit(event: React.FormEvent) {
        event.preventDefault();
        // check password is valid length
        // validateInput(formData);
        if (!formData.username || !formData.password) {
            setMessage({ type: "error", text: "Username and password are required" });
            setSuccess(false);
            throw new Error("Username and password are required")

        }

        if (formData.password.length < 8) {
            setMessage({ type: "error", text: "Password must be at least 8 characters long" });
            setSuccess(false)
            throw new Error("Password must be at least 8 characters long")
        }
        createUserWithEmailAndPassword(auth, formData.username, formData.password)
        .then((userCredential) => {
            // Signed up 
            const user = userCredential.user;
            console.log("created user ", user)
            setMessage({ type: "success", text: "Registration successful!" });
            setSuccess(true)
            const newUser: newUserType = {
               id: user.uid,
               email: user.email ? user.email : ""
           }
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.log("error ", errorCode, errorMessage)
            setMessage({ type: "error", text: "Email already in use or invalid!"})
            setSuccess(false)
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
                <button type="submit">Register!</button>
            </form>
            {message && <p className={`message ${message.type}`}>{message.text}</p>}
            {success && <button onClick={() => navigate("/login")}>Take me to login!</button>}
        </div>
    )
}

export default SignupForm;