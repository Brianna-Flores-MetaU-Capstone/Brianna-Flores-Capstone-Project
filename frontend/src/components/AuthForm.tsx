import React from 'react'
import "../styles/LoginPage.css"
import type { RecipeAuthFormEvents } from '../utils/types'
import { Intolerances, Diets } from '../utils/enum'
import { useState } from 'react'
import RegistrationPreferenceButtons from './RegistrationPreferenceButtons'
import { PreferenceListCategory, AuthenticationFieldType } from '../utils/constants'



const AuthForm = ({handleRegistrationSubmit, handleLoginSubmit, handleAuthInputChange, formData}: RecipeAuthFormEvents) => {
    const [userIntolerances, setUserIntolerances] = useState<string[]>([])
    const [userDiets, setUserDiets] = useState<string[]>([])

    const handlePreferenceClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        const { category, selection } = (event.currentTarget as HTMLButtonElement).dataset
        const setPreferenceList = category === PreferenceListCategory.INTOLERANCES ? setUserIntolerances : setUserDiets;
        const userList = category === PreferenceListCategory.INTOLERANCES ? userIntolerances : userDiets;
        if (selection) {
            if (userList.includes(selection)) {
                setPreferenceList((prev) =>
                prev.filter((item) => item !== selection)
                );
            } else {
                setPreferenceList((prev) => [...prev, selection]);
            }
        }
    }

    const onRegistrationSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        if (handleRegistrationSubmit) {
            handleRegistrationSubmit({userIntolerances, userDiets});
        } else if (handleLoginSubmit) {
            handleLoginSubmit(event)
        }
    }


    return (
        <form className="login-info" onSubmit={onRegistrationSubmit}>
            <label htmlFor={AuthenticationFieldType.EMAIL}>Email</label>
            <input
              id={AuthenticationFieldType.EMAIL}
              type="text"
              data-credential={AuthenticationFieldType.EMAIL}
              value={formData.email}
              onChange={handleAuthInputChange}
              required
            />
            <label htmlFor={AuthenticationFieldType.PASSWORD}>Password</label>
            <input
              id={AuthenticationFieldType.PASSWORD}
              type="password"
              data-credential={AuthenticationFieldType.PASSWORD}
              value={formData.password}
              onChange={handleAuthInputChange}
              required
            />
            {
                handleRegistrationSubmit && 
                <div>
                    <label htmlFor="intolerances">Intolerances</label>
                    <RegistrationPreferenceButtons listName={PreferenceListCategory.INTOLERANCES} listItems={Intolerances} userList={userIntolerances} handleButtonClick={handlePreferenceClick}/>
                    <label>Diets</label>
                    <RegistrationPreferenceButtons listName={PreferenceListCategory.DIETS} listItems={Diets} userList={userDiets} handleButtonClick={handlePreferenceClick} />
                </div>
            }
            <button className="submit-auth" type="submit">{handleRegistrationSubmit ? "Sign Up!" : "Login!"}</button>
          </form>
    )
}

export default AuthForm;