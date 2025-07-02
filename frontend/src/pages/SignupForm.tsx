import { useState } from "react";
import { useNavigate } from "react-router";
import { auth } from "../utils/firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import type { AuthFormResultMessage, RecipeUserAccountInfo, RecipeAuthFormData, RecipeToggleNavBar } from "../utils/types";
import { validateInput, handleNewUser } from "../utils/utils";
import "../styles/LoginPage.css";
import RegistrationForm from "../components/RegistrationForm";
import AppHeader from "../components/AppHeader";
import { Intolerances } from "../utils/enum";
import ErrorState from "../components/ErrorState";

const SignupForm = ({ navOpen, toggleNav }: RecipeToggleNavBar) => {
  const [formData, setFormData] = useState<RecipeAuthFormData>({email: "", password: ""});
  const [message, setMessage] = useState<string>();
  const navigate = useNavigate();
  const [success, setSuccess] = useState(false);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // function handleSubmit(event: React.FormEvent) {
  function handleSubmit({userIntolerances, userDiets}: {userIntolerances: string[], userDiets: string[]}) {
    // event.preventDefault();
    // const valid = validateInput(formData);
    // if (valid.type === "error" && valid.text) {
    //   setSuccess(false);
    //   console.log(valid.text)
    //   setMessage(valid.text);
    //   throw new Error(valid.text);
    // }
    createUserWithEmailAndPassword(auth, formData.email, formData.password)
      .then((userCredential) => {
        // Signed up
        const user = userCredential.user;
        // setMessage("Registration successful!");
        // setSuccess(true);
        const newUser: RecipeUserAccountInfo = {
          firebaseId: user.uid ? user.uid : "",
          email: user.email ? user.email : "",
          intolerances: userIntolerances,
          diets: userDiets
        };
        handleNewUser(newUser);
        setSuccess(true);
      })
      .catch((error) => {
        console.log(error.code)
        setMessage(error.code);
        setSuccess(false);
      });
  }

  return (
    <div className="login-page signup-page">
      <AppHeader navOpen={navOpen} toggleNav={toggleNav}/>
      <section className="login-content">
         <RegistrationForm handleSubmit={handleSubmit} handleChange={handleChange} formData={formData}/>
        {message && !success && <ErrorState errorMessage={message} />}
        {success && (
          <button className="submit-auth" onClick={() => navigate("/login")}>Take me to login!</button>
        )}
      </section>
    </div>
  );
};

export default SignupForm;
