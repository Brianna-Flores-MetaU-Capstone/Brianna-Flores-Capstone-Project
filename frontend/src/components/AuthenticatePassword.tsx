import React from "react";
import { AuthenticationFieldEnum } from "../utils/constants";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";

type GPPasswordAuthenticationProps = {
  handleAccountSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  handleInputChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
};

const AuthenticatePassword: React.FC<GPPasswordAuthenticationProps> = ({
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
