import React from 'react'
import "../styles/LoginPage.css"
import type { RecipeRegistrationFormEvents } from '../utils/types'
import { Intolerances, Diets } from '../utils/enum'
import { useState } from 'react'
import RegistrationPreferenceButtons from './RegistrationPreferenceButtons'
import { PreferenceListCategory, AuthenticationFieldType } from '../utils/constants'



const RegistrationForm = ({handleSubmit, handleChange, formData}: RecipeRegistrationFormEvents) => {
    const [userIntolerances, setUserIntolerances] = useState<string[]>([])
    const [userDiets, setUserDiets] = useState<string[]>([])

    const handlePreferenceClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        const { name, value } = event.currentTarget
        const setPreferenceList = name === PreferenceListCategory.INTOLERANCES ? setUserIntolerances : setUserDiets;
        const userList = name === PreferenceListCategory.INTOLERANCES ? userIntolerances : userDiets;
        if (userList.includes(value)) {
            setPreferenceList((prev) =>
            prev.filter((item) => item !== value)
            );
        } else {
            setPreferenceList((prev) => [...prev, value]);
        }
    }

    const onRegistrationSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        handleSubmit({userIntolerances, userDiets});
    }


    return (
        <form className="login-info" onSubmit={onRegistrationSubmit}>
            <label htmlFor={AuthenticationFieldType.EMAIL}>Email</label>
            <input
              id={AuthenticationFieldType.EMAIL}
              type="text"
              name={AuthenticationFieldType.EMAIL}
              value={formData.email}
              onChange={handleChange}
              required
            />
            <label htmlFor={AuthenticationFieldType.PASSWORD}>Password</label>
            <input
              id={AuthenticationFieldType.PASSWORD}
              type="password"
              name={AuthenticationFieldType.PASSWORD}
              value={formData.password}
              onChange={handleChange}
              required
            />
            <label htmlFor="intolerances">Intolerances</label>
            <RegistrationPreferenceButtons listName={PreferenceListCategory.INTOLERANCES} listItems={Intolerances} userList={userIntolerances} handleButtonClick={handlePreferenceClick}/>
            <label>Diets</label>
            <RegistrationPreferenceButtons listName={PreferenceListCategory.DIETS} listItems={Diets} userList={userDiets} handleButtonClick={handlePreferenceClick} />
            <button className="submit-auth" type="submit">Sign Up!</button>
          </form>
    )
}

export default RegistrationForm;