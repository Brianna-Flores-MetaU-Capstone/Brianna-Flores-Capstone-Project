import React from 'react'
import "../styles/LoginPage.css"
import type { RecipeAuthFormEvents } from '../utils/types'



const LoginRegisterForm = ({handleSubmit, handleChange, formData}: RecipeAuthFormEvents) => {
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
            <button type="submit">Login!</button>
          </form>
    )
}

export default LoginRegisterForm;