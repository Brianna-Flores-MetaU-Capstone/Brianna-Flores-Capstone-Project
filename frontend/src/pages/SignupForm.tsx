import { useState } from "react";
import { useNavigate } from "react-router";
import { auth } from "../utils/firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import type { RecipeAuthFormResult, RecipeUserAccountInfo, RecipeAuthFormData, RecipeToggleNavBar } from "../utils/types";
import { validateInput, handleNewUser } from "../utils/utils";
import "../styles/LoginPage.css";
import RegistrationForm from "../components/RegistrationForm";
import AppHeader from "../components/AppHeader";
import { Intolerances } from "../utils/enum";

const SignupForm = ({ navOpen, toggleNav }: RecipeToggleNavBar) => {
  const [formData, setFormData] = useState<RecipeAuthFormData>({email: "", password: ""});
  const [message, setMessage] = useState<RecipeAuthFormResult>();
  const navigate = useNavigate();
  const [success, setSuccess] = useState(false);

  // const [userIntolerances, setUserIntolerances] = useState<string[]>([])
  // const [userDiets, setUserDiets] = useState<string[]>([])

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };



  // function handleSubmit(event: React.FormEvent) {
  function handleSubmit({userIntolerances, userDiets}: {userIntolerances: string[], userDiets: string[]}) {
    // event.preventDefault();
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
        const newUser: RecipeUserAccountInfo = {
          firebaseId: user.uid ? user.uid : "",
          email: user.email ? user.email : "",
          intolerances: userIntolerances,
          diets: userDiets
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
      <AppHeader navOpen={navOpen} toggleNav={toggleNav}/>
      <section className="login-content">
         <RegistrationForm handleSubmit={handleSubmit} handleChange={handleChange} formData={formData}/>
        {message && <p className={`message ${message.type}`}>{message.text}</p>}
        {success && (
          <button onClick={() => navigate("/login")}>Take me to login!</button>
        )}
      </section>
    </div>
  );
};

export default SignupForm;
