import {
  Modal,
  ModalClose,
  ModalDialog,
  DialogContent,
} from "@mui/joy";
import type { GPRecipeEventOptionType } from "../utils/types";
import CalendarOptionGroup from "./CalendarOptionGroup";
import TitledListView from "./TitledListView";

type GPCalendarModalTypes = {
  modalOpen: boolean;
  toggleModal: () => void;
  eventOptions: GPRecipeEventOptionType[][];
};

const CalendarModal = ({
  modalOpen,
  toggleModal,
  eventOptions,
}: GPCalendarModalTypes) => {
  return (
    <Modal
      aria-labelledby="modal-title"
      aria-describedby="modal-desc"
      open={modalOpen}
      onClose={toggleModal}
    >
      <ModalDialog layout="fullscreen">
        <ModalClose variant="plain" sx={{ m: 1 }} />
        <DialogContent>
          <TitledListView
            headerList={[{ title: "Event Option Groups", spacing: 12 }]}
            list={eventOptions}
            renderItem={(optionGroup, index) => (
              <CalendarOptionGroup key={index} eventOptions={optionGroup} groupNum={index + 1} />
            )}
          />
        </DialogContent>
      </ModalDialog>
    </Modal>
  );
};

export default CalendarModal;
