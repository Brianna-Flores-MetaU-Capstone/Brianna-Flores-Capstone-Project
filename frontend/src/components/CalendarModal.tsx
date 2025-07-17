import {
  Modal,
  ModalClose,
  ModalDialog,
  DialogContent,
  IconButton,
  Typography,
} from "@mui/joy";
import CalendarOptionGroup from "./CalendarOptionGroup";
import TitledListView from "./TitledListView";
import { useEventRec } from "../contexts/EventRecContext";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import { useSelectedEvents } from "../contexts/SelectedEventsContext";
import { MUI_GRID_FULL_SPACE } from "../utils/UIStyle";

type GPCalendarModalTypes = {
  modalOpen: boolean;
  toggleModal: () => void;
};

const CalendarModal = ({ modalOpen, toggleModal }: GPCalendarModalTypes) => {
  const { eventOptions } = useEventRec();
  const { selectedEvents } = useSelectedEvents()

  const onEventConfirmation = () => {
    // TODO create google calendar events
  }

  return (
    <Modal
      aria-labelledby="modal-title"
      aria-describedby="modal-desc"
      open={modalOpen}
      onClose={toggleModal}
    >
      <ModalDialog layout="fullscreen">
        <ModalClose variant="plain" sx={{ zIndex: 2, m: 1 }} />
        <DialogContent sx={{ my: 4 }}>
          <TitledListView
            headerList={[{ title: "Event Option Groups", spacing: MUI_GRID_FULL_SPACE }]}
            itemsList={eventOptions ?? []}
            renderItem={(optionGroup, index) => (
              <CalendarOptionGroup
                key={index}
                eventOptions={optionGroup}
                groupNum={index + 1}
                adjustedSuggestion={false}
              />
            )}
          />
        </DialogContent>
          <IconButton
            aria-label="Accept Event Group Recommendation"
            variant="outlined"
            color="success"
            size="lg"
            onClick={onEventConfirmation}
          >
            <CheckCircleOutlineIcon />
            <Typography>Confirm Selections</Typography>
          </IconButton>
      </ModalDialog>
    </Modal>
  );
};

export default CalendarModal;
