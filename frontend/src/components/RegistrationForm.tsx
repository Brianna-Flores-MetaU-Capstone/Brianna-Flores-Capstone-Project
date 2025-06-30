import React from 'react'
import "../styles/LoginPage.css"
import type { RecipeAuthFormEvents } from '../utils/types'
import { intollerances, diets } from '../utils/enum'
import { useState } from 'react'
import RegistrationPreferenceButtons from './RegistrationPreferenceButtons'



const RegistrationForm = ({handleSubmit, handleChange, formData}: RecipeAuthFormEvents) => {
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


    return (
        <form className="login-info" onSubmit={handleSubmit}>
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="text"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
            <label htmlFor="intollerances">Intollerances</label>
            <RegistrationPreferenceButtons list={intollerances} userList={userIntollerances} handleButtonClick={handleIntolleranceClick}/>
            {/* <div className="intollerance-list">
                {
                    intollerances.map((intollerance) => {
                        return (
                            <button key={intollerance} value={intollerance} id={intollerance} className={userIntollerances.includes(intollerance) ? "intollerance-selected" : "intollerance-not-selected"} type="button" onClick={handleIntolleranceClick}>{intollerance}</button>
                        )
                    })
                }
            </div> */}
            <label>Diets</label>
            <RegistrationPreferenceButtons list={diets} userList={userDiets} handleButtonClick={handleDietClick} />
            <button className="submit-auth" type="submit">Sign Up!</button>
          </form>
    )
}

export default RegistrationForm;