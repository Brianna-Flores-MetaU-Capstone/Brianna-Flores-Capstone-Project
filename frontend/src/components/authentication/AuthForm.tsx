import React from "react";
import { Intolerances, Diets } from "../../utils/enum";
import { useState } from "react";
import RegistrationPreferenceButtons from "./RegistrationPreferenceButtons";
import {
  PreferenceCategoryEnum,
  AuthenticationFieldEnum,
} from "../../utils/constants";
import { Button, Box, Input, FormControl, FormLabel } from "@mui/joy";
import { AuthFormData } from "../../classes/authentication/AuthFormData";

type GPAuthFormEventProps = {
  handleRegistrationSubmit?: ({
    userIntolerances,
    userDiets,
  }: {
    userIntolerances: string[];
    userDiets: string[];
  }) => void;
  handleLoginSubmit?: (event: React.FormEvent) => void;
  handleAuthInputChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  formData: AuthFormData;
};

const AuthForm: React.FC<GPAuthFormEventProps> = ({
  handleRegistrationSubmit,
  handleLoginSubmit,
  handleAuthInputChange,
  formData,
}) => {
  const [userIntolerances, setUserIntolerances] = useState<string[]>([]);
  const [userDiets, setUserDiets] = useState<string[]>([]);
  const [disabled, setDisabled] = useState(false)

  const handlePreferenceClick = (
    event: React.MouseEvent<HTMLButtonElement>,
  ) => {
    const { category, selection } = (event.currentTarget as HTMLButtonElement)
      .dataset;
    const setPreferenceList =
      category === PreferenceCategoryEnum.INTOLERANCES
        ? setUserIntolerances
        : setUserDiets;
    const userList =
      category === PreferenceCategoryEnum.INTOLERANCES
        ? userIntolerances
        : userDiets;
    if (selection) {
      if (userList.includes(selection)) {
        setPreferenceList((prev) => prev.filter((item) => item !== selection));
      } else {
        setPreferenceList((prev) => [...prev, selection]);
      }
    }
  };

  const onRegistrationSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setDisabled(true)
    if (handleRegistrationSubmit) {
      handleRegistrationSubmit({ userIntolerances, userDiets });
    } else if (handleLoginSubmit) {
      handleLoginSubmit(event);
    }
    setDisabled(false)
  };

  return (
    <form onSubmit={onRegistrationSubmit}>
      <FormControl>
        <FormLabel>Enter Email</FormLabel>
        <Input
          required
          id={AuthenticationFieldEnum.EMAIL}
          type="text"
          value={formData.getEmail}
          slotProps={{
            input: { "data-credential": `${AuthenticationFieldEnum.EMAIL}` },
          }}
          onChange={handleAuthInputChange}
        />
      </FormControl>
      <FormControl sx={{ my: 2 }}>
        <FormLabel>Enter Password</FormLabel>
        <Input
          required
          id={AuthenticationFieldEnum.PASSWORD}
          type="password"
          slotProps={{
            input: {
              "data-credential": `${AuthenticationFieldEnum.PASSWORD}`,
            },
          }}
          value={formData.getPassword}
          onChange={handleAuthInputChange}
        />
      </FormControl>
      {handleRegistrationSubmit && (
        <Box>
          <FormLabel>Intolerances</FormLabel>
          <RegistrationPreferenceButtons
            listName={PreferenceCategoryEnum.INTOLERANCES}
            listItems={Intolerances}
            userList={userIntolerances}
            handleButtonClick={handlePreferenceClick}
          />
          <FormLabel>Diets</FormLabel>
          <RegistrationPreferenceButtons
            listName={PreferenceCategoryEnum.DIETS}
            listItems={Diets}
            userList={userDiets}
            handleButtonClick={handlePreferenceClick}
          />
        </Box>
      )}
      <Button type="submit" disabled={disabled} sx={{ display: "block", mx: "auto", mt: 1 }}>
        {handleRegistrationSubmit ? "Sign Up!" : "Login!"}
      </Button>
    </form>
  );
};

export default AuthForm;
