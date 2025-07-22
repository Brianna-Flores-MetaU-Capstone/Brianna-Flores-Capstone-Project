import { Modal, ModalDialog, DialogContent, ModalClose, Typography, Link } from "@mui/joy";
import TitledListView from "../utils/TitledListView";
import { CenteredTitledListStyle, MUI_GRID_FULL_SPACE } from "../../utils/UIStyle";

type GPCalendarLinkTypes = {
    eventLinks: string[]
    modalOpen: boolean
    toggleModal: () => void
}

const CalendarEventLinkModal = ({ eventLinks, modalOpen, toggleModal}: GPCalendarLinkTypes) => {
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
                title: "What would you like to diff?",
                spacing: MUI_GRID_FULL_SPACE,
              },
            ]}
            itemsList={eventLinks}
            renderItem={(link, index) => (
              <Link>{link}</Link>
            )}
            listItemsStyle={CenteredTitledListStyle}
          />
        </DialogContent>
      </ModalDialog>
    </Modal>
  );
};
