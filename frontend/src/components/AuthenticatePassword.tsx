import React from "react";
import { AuthenticationFieldEnum } from "../utils/constants";
import { Button, Box, FormControl, FormLabel, Input } from "@mui/joy";

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
      <FormControl>
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
      </FormControl>
      <Button type="submit">
        Update Account!
      </Button>
    </form>
  );
};

export default AuthenticatePassword;
