import React from 'react'
import "../styles/LoginPage.css"
import type { RecipeLoginFormEvents } from '../utils/types'
import { Authentication } from '../utils/constants'



const LoginForm = ({handleSubmit, handleChange, formData}: RecipeLoginFormEvents) => {
    return (
        <form className="login-info" onSubmit={handleSubmit}>
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
            <button className="submit-auth" type="submit">Login!</button>
          </form>
    )
}

export default LoginForm;