import React from "react";
import { AuthenticationFieldEnum } from "../utils/constants";
import { Button, FormControl, FormHelperText, FormLabel, Input } from "@mui/joy";
import InfoOutlined from "@mui/icons-material/InfoOutlined"

type GPPasswordAuthenticationProps = {
  handleAccountSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  handleInputChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  passwordInputError: boolean
};

const AuthenticatePassword: React.FC<GPPasswordAuthenticationProps> = ({
  handleAccountSubmit,
  handleInputChange,
  passwordInputError
}) => {

  return (
    <form onSubmit={handleAccountSubmit}>
      <FormControl error={passwordInputError}>
        <FormLabel>Confirm Password</FormLabel>
        <Input
          required
          slotProps={{
            input: {
              "data-credential": `${AuthenticationFieldEnum.PASSWORD}`,
            },
          }}
          onChange={handleInputChange}
          type="password"
        />
        {passwordInputError && <FormHelperText>
          <InfoOutlined />
          Enter password to update account
        </FormHelperText>}
      </FormControl>
      <Button sx={{display: "block", mx: "auto", mt: 1}} type="submit">
        Update Account!
      </Button>
    </form>
  );
};

export default AuthenticatePassword;
