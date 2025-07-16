import React from "react";
import Modal from "@mui/joy/Modal";
import Typography from "@mui/joy/Typography";
import Sheet from "@mui/joy/Sheet";
import CircularProgress from "@mui/joy/CircularProgress";

type GPLoadingModalTypes = {
  modalOpen: boolean;
  message: string
};
const LoadingModal = ({ modalOpen, message }: GPLoadingModalTypes) => {
  return (
    // Code based on MUI documentation: https://mui.com/joy-ui/react-modal/
    <div>
      <Modal
        aria-labelledby="Loading"
        aria-describedby="loading screen"
        open={modalOpen}
        sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}
      >
        <Sheet
          variant="outlined"
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 3,
            width: "50%",
            maxWidth: 500,
            borderRadius: "md",
            p: 3,
            boxShadow: "lg",
          }}
        >
          <Typography
            component="h2"
            id="modal-title"
            level="h4"
            textColor="inherit"
            sx={{ fontWeight: "lg", mb: 1 }}
          >
            {message}
          </Typography>
          <CircularProgress variant="soft" />
          <Typography id="modal-desc" textColor="text.tertiary">
            Cant wait to see what all you make!
          </Typography>
        </Sheet>
      </Modal>
    </div>
  );
};

export default LoadingModal;
