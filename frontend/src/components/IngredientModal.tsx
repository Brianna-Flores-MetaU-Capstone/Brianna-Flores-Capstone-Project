import React from "react";
import { useReducer } from "react";
import "../styles/IngredientsPage.css";
import { IngredientUnitOptions, Departments } from "../utils/enum";
import type {
  GPIngredientDataTypes,
  GPErrorMessageTypes,
} from "../utils/types";
import { IngredientDataFields, INGREDIENT_MODAL } from "../utils/constants";
import { GPModalStyle } from "../utils/UIStyle";
import { useState } from "react";
import ErrorState from "./ErrorState";
import { useUser } from "../contexts/UserContext";
import {
  addIngredientDatabase,
  updateIngredientDatabase,
} from "../utils/databaseHelpers";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import InputLabel from "@mui/material/InputLabel";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";

import { FormControl, FormLabel, Input } from "@mui/joy";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";

type GPIngredientModalProps = {
  modalFor: string;
  isEditing: boolean;
  ingredientData?: GPIngredientDataTypes;
  onClose: () => void;
  modalOpen: boolean;
  fetchUserIngredients: () => void;
};

const actions = {
  SET_INPUT: "setInput",
  SET_DATE: "setDate",
} as const;

const IngredientModal: React.FC<GPIngredientModalProps> = ({
  modalFor,
  isEditing,
  ingredientData,
  onClose,
  modalOpen,
  fetchUserIngredients,
}) => {
  const { user } = useUser();
  const [message, setMessage] = useState<GPErrorMessageTypes>();

  const initialIngredientState = ingredientData ?? {
    id: 0,
    ingredientName: "",
    quantity: 0,
    unit: "units",
    department: "",
    expirationDate: null,
    image: "",
    isChecked: false,
  };

  type ACTIONTYPE =
    | {
        type: typeof actions.SET_INPUT;
        ingredientField: keyof GPIngredientDataTypes;
        value: string;
      }
    | { type: typeof actions.SET_DATE; value: string | undefined };

  function reducer(state: GPIngredientDataTypes, action: ACTIONTYPE) {
    switch (action.type) {
      case actions.SET_INPUT:
        return { ...state, [action.ingredientField]: action.value };
      case actions.SET_DATE:
        return { ...state, expirationDate: action.value ?? null };
    }
  }

  const [newIngredientData, dispatch] = useReducer(
    reducer,
    initialIngredientState
  );

  const handleModalSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!user) {
      setMessage({ error: true, message: "Error user not signed in" });
      return;
    }
    if (isEditing) {
      if (ingredientData) {
        const ingredientId = ingredientData.id;
        await updateIngredientDatabase({
          ingredientId,
          newIngredientData,
          setMessage,
        });
      } else {
        setMessage({ error: true, message: "No ingredient to update" });
      }
    } else {
      const userId = user.id;
      await addIngredientDatabase({ userId, newIngredientData, setMessage });
    }
    onClose();
    fetchUserIngredients();
  };

  return (
    <Modal open={modalOpen} onClose={onClose}>
      <Box sx={GPModalStyle}>
        <form className="ingredient-form" onSubmit={handleModalSubmit}>
          {isEditing ? (
            // prevent editing the ingredient name
            <FormControl>
              <FormLabel>Ingredient Name</FormLabel>
              <Input
                disabled
                required
                name={IngredientDataFields.NAME}
                slotProps={{
                  input: {
                    "data-ingredientfield": IngredientDataFields.NAME,
                  },
                }}
                value={newIngredientData?.ingredientName}
                variant="outlined"
              />
            </FormControl>
          ) : (
            <FormControl>
              <FormLabel>Ingredient Name</FormLabel>
              <Input
                required
                name={IngredientDataFields.NAME}
                slotProps={{
                  input: {
                    "data-ingredientfield": IngredientDataFields.NAME,
                  },
                }}
                onChange={(event) =>
                  dispatch({
                    type: actions.SET_INPUT,
                    ingredientField: event?.target
                      .name as keyof GPIngredientDataTypes,
                    value: event.target.value,
                  })
                }
                value={newIngredientData?.ingredientName}
                variant="outlined"
              />
            </FormControl>
          )}
          <Box display="flex" width="100%">
            <FormControl>
              <FormLabel>Quantity</FormLabel>
              <Input
                required
                name={IngredientDataFields.QUANTITY}
                slotProps={{
                  input: {
                    "data-ingredientfield": IngredientDataFields.QUANTITY,
                  },
                }}
                type="number"
                onChange={(event) =>
                  dispatch({
                    type: actions.SET_INPUT,
                    ingredientField: event?.target
                      .name as keyof GPIngredientDataTypes,
                    value: event.target.value,
                  })
                }
                value={newIngredientData?.quantity}
                fullWidth
                variant="outlined"
              />
            </FormControl>
            <Select
              name={IngredientDataFields.UNIT}
              value={newIngredientData?.unit}
              onChange={(event) =>
                dispatch({
                  type: actions.SET_INPUT,
                  ingredientField: event?.target
                    .name as keyof GPIngredientDataTypes,
                  value: event.target.value,
                })
              }
              autoWidth
              label="unit"
            >
              {IngredientUnitOptions.map((unit) => (
                <MenuItem key={unit} value={unit}>
                  {unit}
                </MenuItem>
              ))}
            </Select>
          </Box>
          {modalFor === INGREDIENT_MODAL && (
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                name={IngredientDataFields.EXPIRATION_DATE}
                label="Expiration Date"
                value={
                  newIngredientData?.expirationDate
                    ? dayjs(newIngredientData?.expirationDate)
                    : null
                }
                onChange={(newDate) =>
                  dispatch({
                    type: actions.SET_DATE,
                    value: newDate?.format("YYYY-MM-DD"),
                  })
                }
              />
            </LocalizationProvider>
          )}
          <InputLabel>Select a Department</InputLabel>
          {isEditing ? (
            // prevent edits to department (edits to direct ingredient)
            <Select
              disabled
              name={IngredientDataFields.DEPARTMENT}
              value={newIngredientData?.department}
              label="Department"
            >
              {Departments.map((department) => (
                <MenuItem key={department} value={department}>
                  {department}
                </MenuItem>
              ))}
            </Select>
          ) : (
            <Select
              name={IngredientDataFields.DEPARTMENT}
              value={newIngredientData?.department}
              onChange={(event) =>
                dispatch({
                  type: actions.SET_INPUT,
                  ingredientField: event?.target
                    .name as keyof GPIngredientDataTypes,
                  value: event.target.value,
                })
              }
              label="Department"
            >
              {Departments.map((department) => (
                <MenuItem key={department} value={department}>
                  {department}
                </MenuItem>
              ))}
            </Select>
          )}
          <Button type="submit" className="add-button">
            {isEditing ? "Edit Ingredient!" : "Add Ingredient!"}
          </Button>
        </form>
        {message && (
          <ErrorState error={message.error} message={message.message} />
        )}
      </Box>
    </Modal>
  );
};

export default IngredientModal;
