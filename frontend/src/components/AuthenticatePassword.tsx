import React from "react";
import { AuthenticationFieldEnum } from "../utils/constants";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import type { PasswordAuthenticationProps } from "../utils/types";

const AuthenticatePassword: React.FC<PasswordAuthenticationProps> = ({
  handleAccountSubmit,
  handleInputChange,
}) => {
  return (
    <form className="confirm-password" onSubmit={handleAccountSubmit}>
      <TextField
        required
        slotProps={{
          htmlInput: {
            "data-credential": `${AuthenticationFieldEnum.PASSWORD}`,
          },
        }}
        onChange={handleInputChange}
        type="password"
        label="Confirm Password"
        variant="standard"
      />
      <Button type="submit" variant="outlined">
        Submit
      </Button>
    </form>
  );
};

export default AuthenticatePassword;
