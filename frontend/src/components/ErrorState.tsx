import React from "react";
import { errorCodes } from "../utils/firebase";
import Alert from "@mui/material/Alert";
import type { GPErrorMessageTypes } from "../utils/types";

const ErrorState: React.FC<GPErrorMessageTypes> = ({ error, message }) => {
  const displayedMessage = errorCodes[message] ?? message;
  return (
    <div>
        <Alert severity={error ? "error" : "success"}>{displayedMessage}</Alert>
    </div>
  );
};

export default ErrorState;
