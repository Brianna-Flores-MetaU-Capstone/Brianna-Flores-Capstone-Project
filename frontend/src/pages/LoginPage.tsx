import '../styles/LoginPage.css'
import { useState } from "react";
import type {navigationTypes} from '../utils/types'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import NavBar from "../components/NavBar";
// import { auth } from "../../../backend/index"
// import { signInWithEmailAndPassword } from "firebase/auth";

const LoginPage = ( {navOpen, toggleNav} : navigationTypes) => {
    const [formData, setFormData] = useState({ username: "", password: "" });

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    }

    // function handleSubmit(event: React.FormEvent) {
    //     event.preventDefault();
    //     // console.log("Signup form submitted!", formData);
    //     // check password is valid length
    //     if (!formData.username || !formData.password) {
    //         throw new Error("Username and password are required")
    //     }

    //     signInWithEmailAndPassword(auth, formData.username, formData.password)
    //     .then((userCredential) => {
    //         // Signed in 
    //         const user = userCredential.user;
    //         console.log("signed in user ", user)
    //         // ...
    //     })
    //     .catch((error) => {
    //         const errorCode = error.code;
    //         const errorMessage = error.message;
    //         console.log("error ", errorCode, errorMessage)
    //         // ..
    //     });
    // }
    return (
        <div>
            <button onClick={toggleNav}>
                <FontAwesomeIcon
                icon={faBars}
                className="nav-icon"
                />
            </button>
            {navOpen && <NavBar toggleNav={toggleNav} />}
            {/* <form onSubmit={handleSubmit}> */}
            <form>
                <label htmlFor="username">Email</label>
                <input type="text" name="username" value={formData.username} onChange={handleChange} />
                <label htmlFor="password">Password</label>
                <input type="password" name="password" value={formData.password} onChange={handleChange} />
                <button type="submit">Login!</button>
            </form>
        </div>
    )
}

export default LoginPage;