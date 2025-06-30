import { useState } from "react";
import { useNavigate } from "react-router";
import { auth } from "../utils/firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import type { RecipeAuthFormResult, RecipeNewUserFirebaseId, RecipeAuthFormData, RecipeToggleNavBar } from "../utils/types";
import { validateInput, handleNewUser } from "../utils/utils";
import "../styles/LoginPage.css";
import RegistrationForm from "../components/RegistrationForm";
import AppHeader from "../components/AppHeader";

const SignupForm = ({ navOpen, toggleNav }: RecipeToggleNavBar) => {
  // const [formData, setFormData] = useState<RecipeAuthFormData>({email: "", password: ""});
  const [formData, setFormData] = useState<RecipeAuthFormData>({email: "", password: ""});
  const [message, setMessage] = useState<RecipeAuthFormResult>();
  const navigate = useNavigate();
  const [success, setSuccess] = useState(false);

  const [userIntollerances, setUserIntollerances] = useState<string[]>([])
  const [userDiets, setUserDiets] = useState<string[]>([])

  const handleIntolleranceClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        const selectedIntollerance = event.currentTarget.value;
        if (userIntollerances.includes(selectedIntollerance)) {
            setUserIntollerances((prev) => prev.filter((intollerance => intollerance !== selectedIntollerance)))
        } else {
            setUserIntollerances((prev) => [...prev, selectedIntollerance])
        }
    }

    const handleDietClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        const selectedDiet = event.currentTarget.value;
        if (userDiets.includes(selectedDiet)) {
            setUserDiets((prev) => prev.filter((diet => diet !== selectedDiet)))
        } else {
            setUserDiets((prev) => [...prev, selectedDiet])
        }
    }

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
        const newUser: RecipeNewUserFirebaseId = {
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
