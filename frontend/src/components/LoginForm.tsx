import React from 'react'
import "../styles/LoginPage.css"
import type { RecipeLoginFormEvents } from '../utils/types'
import { AuthenticationFieldType } from '../utils/constants'



const LoginForm = ({handleSubmit, handleChange, formData}: RecipeLoginFormEvents) => {
    return (
        <form className="login-info" onSubmit={handleSubmit}>
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
            <button className="submit-auth" type="submit">Login!</button>
          </form>
    )
}

export default LoginForm;