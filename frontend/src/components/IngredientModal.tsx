import React from "react";
import { useReducer } from "react";
import "../styles/IngredientsPage.css";
import { IngredientUnitOptions, Departments } from "../utils/enum";
import type {
  GPIngredientDataTypes,
  GPIngredientsOnHandTypes,
} from "../utils/types";
import { IngredientDataFields, INGREDIENT_MODAL } from "../utils/constants";
import TextField from "@mui/material/TextField";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import InputLabel from "@mui/material/InputLabel";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import { GPModalStyle } from "../utils/utils";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs, { Dayjs } from "dayjs";

import { useState } from "react";
import type { GPErrorMessageTypes } from "../utils/types";
import ErrorState from "./ErrorState";
import { useUser } from "../contexts/UserContext";

type GPIngredientModalProps = {
  modalFor: string;
  isEditing: boolean;
  ingredientData?: GPIngredientDataTypes;
  onClose: () => void;
  modalOpen: boolean;
  updateUserIngredients: () => void;
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
  updateUserIngredients,
}) => {
  const { user } = useUser();
  const [message, setMessage] = useState<GPErrorMessageTypes>();

  const initialIngredientState = ingredientData ?? {
    id: 0,
    ingredientName: "",
    quantity: "",
    unit: "units",
    department: "",
    expirationDate: null,
    image: "",
    estimatedCost: 0,
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

  // add an ingredient to the list of ingredients on hand
  const addNewIngredient = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!user) {
      setMessage({ error: true, message: "Error user not signed in" });
      return;
    }

    const userId = user.id;
    const response = await fetch(
      `http://localhost:3000/ingredients/${userId}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newIngredientData),
        credentials: "include",
      }
    );
    if (!response.ok) {
      setMessage({ error: true, message: "Failed to create ingredient" });
      return;
    }
    const data = await response.json();
    setMessage({ error: false, message: "Sucessfully created ingredient" });
    onClose();
    const ingredientOnHand: GPIngredientsOnHandTypes = {
      userId: userId,
      ingredient: data,
      ingredientId: "1",
    };
    updateUserIngredients();
    return ingredientOnHand;
  };

  const updateIngredient = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!user) {
      setMessage({ error: true, message: "Error user not signed in" });
      return;
    }

    const userId = user.id;
    const response = await fetch(
      `http://localhost:3000/ingredients/${ingredientData?.id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newIngredientData),
        credentials: "include",
      }
    );
    if (!response.ok) {
      setMessage({ error: true, message: "Failed to update ingredient" });
      return;
    }
    const data = await response.json();
    setMessage({ error: false, message: "Sucessfully updated ingredient" });
    onClose();
    const ingredientOnHand: GPIngredientsOnHandTypes = {
      userId: userId,
      ingredient: data,
      ingredientId: "1",
    };
    updateUserIngredients();
    return ingredientOnHand;
  };

  return (
    <Modal open={modalOpen} onClose={onClose}>
      <Box sx={GPModalStyle}>
        <form
          className="ingredient-form"
          onSubmit={isEditing ? updateIngredient : addNewIngredient}
        >
          {isEditing ? 
          // prevent editing the ingredient name
          (<TextField
            disabled
            required
            name={IngredientDataFields.NAME}
            slotProps={{
              htmlInput: {
                "data-ingredientfield": IngredientDataFields.NAME,
              },
            }}
            value={newIngredientData?.ingredientName}
            label="Ingredient Name"
            variant="standard"
          />) :
          (<TextField
            required
            name={IngredientDataFields.NAME}
            slotProps={{
              htmlInput: {
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
            label="Ingredient Name"
            variant="standard"
          />)}
          <Box display="flex" width="100%">
            <TextField
              required
              name={IngredientDataFields.QUANTITY}
              slotProps={{
                htmlInput: {
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
              label="Quantity"
              variant="standard"
            />
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
          {isEditing ? 
          // prevent edits to department (edits to direct ingredient)
          (<Select
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
          </Select>) :
          (<Select
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
          </Select>)}
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
