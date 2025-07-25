import React from "react";
import TitledListView from "../utils/TitledListView";
import { Button } from "@mui/joy";
import { CenteredTitledListStyle } from "../../utils/style/UIStyle";

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
      itemsList={listItems}
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
      listItemsStyle={CenteredTitledListStyle}
    />
  );
};

export default RegistrationPreferenceButtons;
