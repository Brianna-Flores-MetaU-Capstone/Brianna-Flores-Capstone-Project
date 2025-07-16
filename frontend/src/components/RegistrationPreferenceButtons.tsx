import React from "react";
import TitledListView from "./TitledListView";
import { Button } from "@mui/joy";

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
      list={listItems}
      renderItem={(item) => (
        <Button
          key={item}
          data-category={listName}
          data-selection={item}
          id={item}
          variant={userList.includes(item) ? "solid" : "soft"}
          type="button"
          onClick={handleButtonClick}
        >
          {item}
        </Button>
      )}
      flexDirectionRow={true}
    />
  );
};

export default RegistrationPreferenceButtons;
