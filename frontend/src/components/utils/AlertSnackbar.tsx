import { Snackbar } from "@mui/joy";

type GPAlertSnackbarTypes = {
  open: boolean;
  message: string;
  error: boolean;
};

const AlertSnackbar = ({ open, message, error }: GPAlertSnackbarTypes) => {
  return (
    <Snackbar
        autoHideDuration={3000}
        open={open}
        variant="soft"
        color={error ? "danger" : "success"}
      >
        {message}
      </Snackbar>
  );
};

export default AlertSnackbar;
