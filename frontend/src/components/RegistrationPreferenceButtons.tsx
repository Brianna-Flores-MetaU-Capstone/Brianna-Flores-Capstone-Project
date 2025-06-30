import React from 'react'
import "../styles/LoginPage.css"

const RegistrationPreferenceButtons = ({list, userList, handleButtonClick}: {list: string[], userList: string[], handleButtonClick: (event: React.MouseEvent<HTMLButtonElement>) => void}) => {
    
    return (
        // <div className={`${listType}-list`}>
        <div className="preference-list">
            {
                list.map((item) => {
                    return (
                        // <button key={item} value={item} id={item} className={userList.includes(item) ? `${listType}-selected` : `${listType}-not-selected`} type="button" onClick={handleButtonClick}>{item}</button>
                        <button key={item} value={item} id={item} className={userList.includes(item) ? "preference-selected" : "preference-not-selected"} type="button" onClick={handleButtonClick}>{item}</button>
                    )
                })
            }
        </div>
    )
}

export default RegistrationPreferenceButtons