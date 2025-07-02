import React from 'react'
import "../styles/LoginPage.css"
import type { RecipeLoginFormEvents } from '../utils/types'



const LoginForm = ({handleSubmit, handleChange, formData}: RecipeLoginFormEvents) => {
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
            <button className="submit-auth" type="submit">Login!</button>
          </form>
    )
}

export default LoginForm;