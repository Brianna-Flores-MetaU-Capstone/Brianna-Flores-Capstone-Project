import React from 'react'
import "../styles/LoginPage.css"

const RegistrationPreferenceButtons = ({listName, listItems, userList, handleButtonClick}: {listName: string, listItems: string[], userList: string[], handleButtonClick: (event: React.MouseEvent<HTMLButtonElement>) => void}) => {
    
    return (
        <div className="preference-list">
            {
                listItems.map((item) => {
                    return (
                        <button key={item} name={listName} value={item} id={item} className={userList.includes(item) ? "preference-selected" : "preference-not-selected"} type="button" onClick={handleButtonClick}>{item}</button>
                    )
                })
            }
        </div>
    )
}

export default RegistrationPreferenceButtons