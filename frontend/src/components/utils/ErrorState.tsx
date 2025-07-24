import React from "react";
import { errorCodes } from "../../utils/firebase";
import Alert from "@mui/joy/Alert";
import ReportIcon from "@mui/icons-material/Report";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import type { GPErrorMessageTypes } from "../../utils/types/types";

const ErrorState: React.FC<GPErrorMessageTypes> = ({ error, message }) => {
  const displayedMessage = errorCodes[message] ?? message;
  return (
    <div>
      <Alert
        startDecorator={error ? <ReportIcon /> : <CheckCircleIcon />}
        sx={{ alignItems: "flex-start", my: 1 }}
        color={error ? "danger" : "success"}
      >
        {displayedMessage}
      </Alert>
    </div>
  );
};

export default ErrorState;
