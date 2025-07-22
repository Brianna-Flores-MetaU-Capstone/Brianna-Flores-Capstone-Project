import {
  Modal,
  ModalClose,
  ModalDialog,
  Typography,
  DialogContent,
  Checkbox,
  Box,
  Button,
} from "@mui/joy";
import TitledListView from "../utils/TitledListView";
import {
  CenteredTitledListStyle,
  MUI_GRID_FULL_SPACE,
} from "../../utils/UIStyle";
import { useState } from "react";

type GPUserDiffOptionsType = {
  modalOpen: boolean;
  toggleModal: () => void;
  onSubmit: (value: Set<string>) => void;
};

const GPDiffOptionsEnum = {
  TITLE: "Diff Title",
  SERVINGS: "Diff Servings",
  COOK_TIME: "Diff Cook Time",
  TAGS: "Diff Recipe Tags",
  INGREDIENTS: "Diff Ingredients",
  INSTRUCTIONS: "Diff Instructions",
} as const;

type DiffOptionsKeys = keyof typeof GPDiffOptionsEnum;
type DiffOptionsType = (typeof GPDiffOptionsEnum)[DiffOptionsKeys];

const UserDiffOptions = ({
  modalOpen,
  toggleModal,
  onSubmit,
}: GPUserDiffOptionsType) => {
  const [userDiffChoices, setUserDiffChoices] = useState(new Set<string>());
  return (
    <Modal
      aria-labelledby="modal-title"
      aria-describedby="modal-desc"
      open={modalOpen}
      onClose={toggleModal}
    >
      <ModalDialog>
        <ModalClose variant="plain" sx={{ zIndex: 2, m: 1 }} />
        <DialogContent sx={{ my: 4 }}>
          <TitledListView
            headerList={[
              { title: "Choose What to Diff", spacing: MUI_GRID_FULL_SPACE },
            ]}
            itemsList={Object.values(GPDiffOptionsEnum)}
            renderItem={(diffOption, index) => (
              <Checkbox
                key={index}
                label={diffOption}
                onChange={(event) => {
                  if (event.target.checked) {
                    setUserDiffChoices((prev) => new Set(prev.add(diffOption)));
                  } else {
                    setUserDiffChoices((prev) => {
                      prev.delete(diffOption);
                      return new Set(prev);
                    });
                  }
                }}
              />
            )}
            listItemsStyle={CenteredTitledListStyle}
          />
          <Button onClick={() => onSubmit(userDiffChoices)}>Submit!</Button>
        </DialogContent>
      </ModalDialog>
    </Modal>
  );
};

export { GPDiffOptionsEnum }
export default UserDiffOptions;
