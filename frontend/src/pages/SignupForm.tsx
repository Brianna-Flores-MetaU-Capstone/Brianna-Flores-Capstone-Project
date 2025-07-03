import { useState } from "react";
import { useNavigate } from "react-router";
import { auth } from "../utils/firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import type { RecipeUserAccountInfo, RecipeAuthFormData, RecipeToggleNavBar } from "../utils/types";
import { handleNewUser } from "../utils/utils";
import "../styles/LoginPage.css";
import RegistrationForm from "../components/RegistrationForm";
import AppHeader from "../components/AppHeader";
import ErrorState from "../components/ErrorState";

const SignupForm = ({ navOpen, toggleNav }: RecipeToggleNavBar) => {
  const [formData, setFormData] = useState<RecipeAuthFormData>({email: "", password: ""});
  const [message, setMessage] = useState<string>();
  const navigate = useNavigate();
  const [success, setSuccess] = useState(false);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  function handleSubmit({userIntolerances, userDiets}: {userIntolerances: string[], userDiets: string[]}) {
    createUserWithEmailAndPassword(auth, formData.email, formData.password)
      .then((userCredential) => {
        // Signed up
        const user = userCredential.user;
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
        setMessage(error.code);
        setSuccess(false);
      });
  }

  return (
    <div className="login-page signup-page">
      <AppHeader navOpen={navOpen} toggleNav={toggleNav}/>
      <section className="login-content">
         <RegistrationForm handleRegistrationSubmit={handleSubmit} handleInputChange={handleInputChange} formData={formData}/>
        {message && !success && <ErrorState errorMessage={message} />}
        {success && (
          <button className="submit-auth" onClick={() => navigate("/login")}>Take me to login!</button>
        )}
      </section>
    </div>
  );
};

export default SignupForm;
