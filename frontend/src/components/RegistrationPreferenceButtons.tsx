import React from "react";
import "../styles/LoginPage.css";

interface UserPreferenceButtonsProps {
  listName: string;
  listItems: string[];
  userList: string[];
  handleButtonClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

const RegistrationPreferenceButtons: React.FC<UserPreferenceButtonsProps> = ({
  listName,
  listItems,
  userList,
  handleButtonClick,
}) => {
  return (
    <div className="preference-list">
      {listItems.map((item) => {
        return (
          <button
            key={item}
            data-category={listName}
            data-selection={item}
            id={item}
            className={
              userList.includes(item)
                ? "preference-selected"
                : "preference-not-selected"
            }
            type="button"
            onClick={handleButtonClick}
          >
            {item}
          </button>
        );
      })}
    </div>
  );
};

export default RegistrationPreferenceButtons;
