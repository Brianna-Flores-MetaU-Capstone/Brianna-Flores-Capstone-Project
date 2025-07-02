import React from 'react'
import { errorCodes } from '../utils/firebase'
const ErrorState = ({errorMessage}: {errorMessage: string}) => {
    const displayedMessage = errorCodes[errorMessage]
    return  (
        <div>
            <p className="error-message">{displayedMessage ?? "Try Again"}</p>
        </div>
    )
}

export default ErrorState