import React from 'react'
import "../styles/LoginPage.css"
// import type { RecipeAuthFormEvents } from '../utils/types'
import type { RecipeRegistrationFormEvents } from '../utils/types'
import { Intolerances, Diets } from '../utils/enum'
import { useState } from 'react'
import RegistrationPreferenceButtons from './RegistrationPreferenceButtons'
import { PreferenceList, Authentication } from '../utils/constants'



const RegistrationForm = ({handleSubmit, handleChange, formData}: RecipeRegistrationFormEvents) => {
    const [userIntolerances, setUserIntolerances] = useState<string[]>([])
    const [userDiets, setUserDiets] = useState<string[]>([])

    const handlePreferenceClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        const { name, value } = event.currentTarget
        const setterFunction = name === PreferenceList.INTOLERANCES ? setUserIntolerances : setUserDiets;
        const userList = name === PreferenceList.INTOLERANCES ? userIntolerances : userDiets;
        if (userList.includes(value)) {
            setterFunction((prev) =>
            prev.filter((item) => item !== value)
            );
        } else {
            setterFunction((prev) => [...prev, value]);
        }
    }

    const onRegistrationSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        handleSubmit({userIntolerances, userDiets});
    }


    return (
        <form className="login-info" onSubmit={onRegistrationSubmit}>
            <label htmlFor={Authentication.EMAIL}>Email</label>
            <input
              id={Authentication.EMAIL}
              type="text"
              name={Authentication.EMAIL}
              value={formData.email}
              onChange={handleChange}
              required
            />
            <label htmlFor={Authentication.PASSWORD}>Password</label>
            <input
              id={Authentication.PASSWORD}
              type="password"
              name={Authentication.PASSWORD}
              value={formData.password}
              onChange={handleChange}
              required
            />
            <label htmlFor="intolerances">Intolerances</label>
            <RegistrationPreferenceButtons listName={PreferenceList.INTOLERANCES} listItems={Intolerances} userList={userIntolerances} handleButtonClick={handlePreferenceClick}/>
            <label>Diets</label>
            <RegistrationPreferenceButtons listName={PreferenceList.DIETS} listItems={Diets} userList={userDiets} handleButtonClick={handlePreferenceClick} />
            <button className="submit-auth" type="submit">Sign Up!</button>
          </form>
    )
}

export default RegistrationForm;