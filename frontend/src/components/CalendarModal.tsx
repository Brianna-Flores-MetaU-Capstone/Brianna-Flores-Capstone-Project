import {
  Modal,
  ModalClose,
  ModalDialog,
  DialogContent,
} from "@mui/joy";
import CalendarOptionGroup from "./CalendarOptionGroup";
import TitledListView from "./TitledListView";
import { useEventRec } from "../contexts/EventRecContext";


type GPCalendarModalTypes = {
  modalOpen: boolean;
  toggleModal: () => void;
};

const CalendarModal = ({
  modalOpen,
  toggleModal,
}: GPCalendarModalTypes) => {
  const {eventOptions} = useEventRec()
  return (
    <Modal
      aria-labelledby="modal-title"
      aria-describedby="modal-desc"
      open={modalOpen}
      onClose={toggleModal}
    >
      <ModalDialog layout="fullscreen">
        <ModalClose variant="plain" sx={{ zIndex: 2, m: 1 }} />
        <DialogContent sx={{my: 4}}>
          <TitledListView
            headerList={[{ title: "Event Option Groups", spacing: 12 }]}
            list={eventOptions ?? []}
            renderItem={(optionGroup, index) => (
              <CalendarOptionGroup key={index} eventOptions={optionGroup} groupNum={index + 1} adjustedSuggestion={false} />
            )}
          />
        </DialogContent>
      </ModalDialog>
    </Modal>
  );
};

export default CalendarModal;
