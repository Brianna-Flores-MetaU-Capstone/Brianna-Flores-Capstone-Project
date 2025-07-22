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
import { GPDiffOptionsEnum } from "../../classes/recipeDiffClasses/DiffRecipes";

type GPUserDiffOptionsType = {
  modalOpen: boolean;
  toggleModal: () => void;
  onSubmit: (value: Set<string>, noDiff: Set<string>) => void;
};

const UserDiffOptions = ({
  modalOpen,
  toggleModal,
  onSubmit,
}: GPUserDiffOptionsType) => {
  const [userDiffChoices, setUserDiffChoices] = useState(new Set<string>());

  const submitUserDiffOptions = () => {
    const noDiffFields = new Set<string>();
    for (const request of Object.values(GPDiffOptionsEnum)) {
      if (!userDiffChoices.has(request)) {
        noDiffFields.add(request);
      }
    }
    onSubmit(userDiffChoices, noDiffFields);
    setUserDiffChoices(new Set());
  };

  return (
    <Modal
      aria-labelledby="modal-title"
      aria-describedby="modal-desc"
      open={modalOpen}
      onClose={toggleModal}
    >
      <ModalDialog maxWidth={500}>
        <ModalClose
          onClick={() => setUserDiffChoices(new Set())}
          variant="plain"
          sx={{ zIndex: 2, m: 1 }}
        />
        <DialogContent sx={{ my: 3 }}>
          <TitledListView
            headerList={[
              {
                title: "What would you like to diff?",
                spacing: MUI_GRID_FULL_SPACE,
              },
            ]}
            itemsList={Object.values(GPDiffOptionsEnum)}
            renderItem={(diffOption, index) => (
              <Checkbox
                key={index}
                label={diffOption}
                value={diffOption}
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
          <Button sx={{ mt: 3 }} onClick={submitUserDiffOptions}>
            Submit!
          </Button>
        </DialogContent>
      </ModalDialog>
    </Modal>
  );
};

export { GPDiffOptionsEnum };
export default UserDiffOptions;
