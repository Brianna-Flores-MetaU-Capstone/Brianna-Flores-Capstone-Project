import React from "react";
import "../styles/LoginPage.css";
import TitledListView from "./TitledListView";

type GPUserPreferenceButtonsProps = {
  listName: string;
  listItems: string[];
  userList: string[];
  handleButtonClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
};

const RegistrationPreferenceButtons: React.FC<GPUserPreferenceButtonsProps> = ({
  listName,
  listItems,
  userList,
  handleButtonClick,
}) => {
  return (
    <TitledListView
      className="preference-list"
      list={listItems}
      renderItem={(item) => (
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
      )}
    />
  );
};

export default RegistrationPreferenceButtons;
