import React from 'react'
import "../styles/LoginPage.css"
import type { RecipeAuthFormEvents } from '../utils/types'
import { intollerances } from '../utils/enum'
import { useState } from 'react'



const RegistrationForm = ({handleSubmit, handleChange, formData}: RecipeAuthFormEvents) => {
    const [userIntollerances, setUserIntollerances] = useState<string[]>([])

    const handleIntolleranceClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        const selectedIntollerance = event.currentTarget.value;
        if (userIntollerances.includes(selectedIntollerance)) {
            setUserIntollerances((prev) => prev.filter((intollerance => intollerance !== selectedIntollerance)))
            event.currentTarget.id = "intollerance-not-selected"
        } else {
            setUserIntollerances((prev) => [...prev, selectedIntollerance])
            event.currentTarget.id = "intollerance-selected"
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
            <div className="intollerance-list">
                {
                    intollerances.map((intollerance) => {
                        return (
                            <button value={intollerance} id={intollerance} className={userIntollerances.includes(intollerance) ? "intollerance-selected" : "intollerance-not-selected"} type="button" onClick={handleIntolleranceClick}>{intollerance}</button>
                            // <button value={intollerance} id={userIntollerances.includes(intollerance) ? "intollerance-selected" : "intollerance-not-selected"} className="intollerance-button" type="button" onClick={handleIntolleranceClick}>{intollerance}</button>
                        )
                    })
                }
            </div>
            <button className="submit-auth" type="submit">Sign Up!</button>
          </form>
    )
}

export default RegistrationForm;