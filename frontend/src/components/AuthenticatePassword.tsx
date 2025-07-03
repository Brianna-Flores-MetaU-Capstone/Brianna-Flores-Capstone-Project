import React from "react";
import { AuthenticationFieldEnum } from "../utils/constants";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
// import SharedInput from "./SharedInput";

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
      {/* <SharedInput inputLabel="Confirm Password" inputType="password" fieldData={AuthenticationFieldEnum.PASSWORD} handleInputChange={handleInputChange}/>       */}
      <Button type="submit" variant="outlined">Submit</Button>
    </form>
  );
};

export default AuthenticatePassword;
