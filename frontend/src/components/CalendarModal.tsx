import React from "react";
import { Modal, Sheet, ModalClose, Typography } from "@mui/joy";
import type { GPRecipeEventOptionType } from "../utils/types";

type GPCalendarModalTypes = {
  modalOpen: boolean;
  toggleModal: () => void;
  eventOptions: GPRecipeEventOptionType[][];
}

const CalendarModal = ({modalOpen, toggleModal, eventOptions}: GPCalendarModalTypes) => {
  return (
    <Modal
      aria-labelledby="modal-title"
      aria-describedby="modal-desc"
      open={modalOpen}
      onClose={toggleModal}
      sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}
    >
      <Sheet
        variant="outlined"
        sx={{ maxWidth: 500, borderRadius: "md", p: 3, boxShadow: "lg" }}
      >
        <ModalClose variant="plain" sx={{ m: 1 }} />
        <Typography
          component="h2"
          id="modal-title"
          level="h4"
          textColor="inherit"
          sx={{ fontWeight: "lg", mb: 1 }}
        >
          This is the modal title
        </Typography>
        <Typography id="modal-desc" textColor="text.tertiary">
          Make sure to use <code>aria-labelledby</code> on the modal dialog with
          an optional <code>aria-describedby</code> attribute.
        </Typography>
      </Sheet>
    </Modal>
  );
};

export default CalendarModal;
