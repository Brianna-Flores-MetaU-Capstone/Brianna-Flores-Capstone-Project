import React from "react";
import "../styles/LoginPage.css";
import { Intolerances, Diets } from "../utils/enum";
import { useState } from "react";
import RegistrationPreferenceButtons from "./RegistrationPreferenceButtons";
import {
  PreferenceCategoryEnum,
  AuthenticationFieldEnum,
} from "../utils/constants";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import type { GPAuthFormDataTypes } from "../utils/types";

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
  formData: GPAuthFormDataTypes;
};

const AuthForm: React.FC<GPAuthFormEventProps> = ({
  handleRegistrationSubmit,
  handleLoginSubmit,
  handleAuthInputChange,
  formData,
}) => {
  const [userIntolerances, setUserIntolerances] = useState<string[]>([]);
  const [userDiets, setUserDiets] = useState<string[]>([]);

  const handlePreferenceClick = (
    event: React.MouseEvent<HTMLButtonElement>
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
    if (handleRegistrationSubmit) {
      handleRegistrationSubmit({ userIntolerances, userDiets });
    } else if (handleLoginSubmit) {
      handleLoginSubmit(event);
    }
  };

  return (
    <form className="login-info" onSubmit={onRegistrationSubmit}>
      <TextField
        required
        id={AuthenticationFieldEnum.EMAIL}
        type="text"
        value={formData.email}
        slotProps={{
          htmlInput: { "data-credential": `${AuthenticationFieldEnum.EMAIL}` },
        }}
        onChange={handleAuthInputChange}
        label="Enter Email"
        variant="standard"
      />
      <TextField
        required
        id={AuthenticationFieldEnum.PASSWORD}
        type="password"
        slotProps={{
          htmlInput: {
            "data-credential": `${AuthenticationFieldEnum.PASSWORD}`,
          },
        }}
        value={formData.password}
        onChange={handleAuthInputChange}
        label="Enter Password"
        variant="standard"
      />
      {handleRegistrationSubmit && (
        <div>
          <label htmlFor="intolerances">Intolerances</label>
          <RegistrationPreferenceButtons
            listName={PreferenceCategoryEnum.INTOLERANCES}
            listItems={Intolerances}
            userList={userIntolerances}
            handleButtonClick={handlePreferenceClick}
          />
          <label>Diets</label>
          <RegistrationPreferenceButtons
            listName={PreferenceCategoryEnum.DIETS}
            listItems={Diets}
            userList={userDiets}
            handleButtonClick={handlePreferenceClick}
          />
        </div>
      )}
      <Button className="submit-auth" type="submit" variant="outlined">
        {handleRegistrationSubmit ? "Sign Up!" : "Login!"}
      </Button>
    </form>
  );
};

export default AuthForm;
