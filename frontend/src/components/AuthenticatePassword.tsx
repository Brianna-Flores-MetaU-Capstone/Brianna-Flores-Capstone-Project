import React from "react";
import { AuthenticationFieldEnum } from "../utils/constants";
import { Button, FormControl, FormLabel, Input } from "@mui/joy";

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
          variant="plain"
        />
      </FormControl>
      <Button type="submit" variant="outlined">
        Submit
      </Button>
    </form>
  );
};

export default AuthenticatePassword;
