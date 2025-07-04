import React from "react";
import { errorCodes } from "../utils/firebase";

interface ErrorDisplayProps {
  errorMessage: string;
}

const ErrorState: React.FC<ErrorDisplayProps> = ({ errorMessage }) => {
  const displayedMessage = errorCodes[errorMessage];
  return (
    <div>
      <p className="error-message">{displayedMessage ?? "Try Again"}</p>
    </div>
  );
};

export default ErrorState;
