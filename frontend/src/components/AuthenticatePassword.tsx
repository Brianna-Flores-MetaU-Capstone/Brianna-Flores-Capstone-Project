import React from "react";
import { AuthenticationFieldEnum } from "../utils/constants";
import TextField from "@mui/material/TextField";
// import Button from "@mui/material/button"

const AuthenticatePassword = ({
  handleAccountSubmit,
  handleInputChange,
}: {
  handleAccountSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  handleInputChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}) => {
  return (
    <form className="confirm-password" onSubmit={handleAccountSubmit}>
      <TextField required slotProps={{htmlInput: { 'data-credential': `${AuthenticationFieldEnum.PASSWORD}`}}} onChange={handleInputChange} type="password" label="Confirm Password" variant="standard" />
      {/* <Button variant="outline">Submit</Button> */}
      <button className="submit-auth" type="submit">
        Submit
      </button>
    </form>
  );
};

export default AuthenticatePassword;
