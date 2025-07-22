import {
  Modal,
  ModalDialog,
  DialogContent,
  ModalClose,
  Typography,
  Link,
  Box,
} from "@mui/joy";
import TitledListView from "../utils/TitledListView";
import {
  CenteredTitledListStyle,
  MUI_GRID_FULL_SPACE,
} from "../../utils/UIStyle";
import { CalendarEvent } from "../../classes/calendar/CalendarEvent";

type GPCalendarLinkTypes = {
  events: CalendarEvent[];
  modalOpen: boolean;
  toggleModal: () => void;
};

const EventSummaryModal = ({
  events,
  modalOpen,
  toggleModal,
}: GPCalendarLinkTypes) => {
  return (
    <Modal
      aria-labelledby="modal-title"
      aria-describedby="modal-desc"
      open={modalOpen}
      onClose={toggleModal}
    >
      <ModalDialog maxWidth={500}>
        <ModalClose
          onClick={toggleModal}
          variant="plain"
          sx={{ zIndex: 2, m: 1 }}
        />
        <DialogContent sx={{ my: 3 }}>
          <TitledListView
            headerList={[
              {
                title: "Created Events",
                spacing: MUI_GRID_FULL_SPACE,
              },
            ]}
            itemsList={events}
            renderItem={(event, index) => (
              <Box>
                <Typography>{event.eventTitle}</Typography>
                <Link key={index}>{event.eventLink}</Link>
              </Box>
            )}
            listItemsStyle={CenteredTitledListStyle}
          />
        </DialogContent>
      </ModalDialog>
    </Modal>
  );
};

export default EventSummaryModal;
