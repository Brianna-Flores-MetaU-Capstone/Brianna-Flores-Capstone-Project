import React from 'react'
import { AuthenticationFieldType } from '../utils/constants'

const AuthenticatePassword = ({handleAccountSubmit, handleInputChange}: {handleAccountSubmit: ((event: React.FormEvent<HTMLFormElement>) => void), handleInputChange: ((event: React.ChangeEvent<HTMLInputElement>) => void)}) => {
    return (
        <form className="confirm-password" onSubmit={handleAccountSubmit}>
            <h3>Confirm Password</h3>
            <input type="password" data-credential={AuthenticationFieldType.PASSWORD} id={AuthenticationFieldType.PASSWORD} onChange={handleInputChange} required/>
            <button className="submit-auth" type="submit">Submit</button>
        </form>
    )
}

export default AuthenticatePassword;