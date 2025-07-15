import React from "react";
import {
  Modal,
  Sheet,
  ModalClose,
  Typography,
  ModalDialog,
  DialogTitle,
  DialogContent,
} from "@mui/joy";
import type { GPRecipeEventOptionType } from "../utils/types";
import CalendarEventOption from "./CalendarEventOption";

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
        <DialogTitle>Event Suggestions</DialogTitle>
        <DialogContent>
          {eventOptions && eventOptions[0] && eventOptions[0][0] && (
            <CalendarEventOption eventOption={eventOptions[0][0]} />
          )}
        </DialogContent>
      </ModalDialog>
    </Modal>
  );
};

export default CalendarModal;
