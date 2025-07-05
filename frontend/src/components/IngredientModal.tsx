import React from "react";
import { useReducer } from "react";
import "../styles/IngredientsPage.css";
import { IngredientUnitOptions, Departments } from "../utils/enum";
import type { GPIngredientDataTypes } from "../utils/types";
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

type GPIngredientModalProps = {
  modalFor: string;
  ingredientData?: GPIngredientDataTypes;
  onClose: () => void;
  modalOpen: boolean;
};

const actions = {
  SET_INPUT: "setInput",
  SET_DATE: "setDate",
} as const;

const IngredientModal: React.FC<GPIngredientModalProps> = ({
  modalFor,
  ingredientData,
  onClose,
  modalOpen,
}) => {
  const initialIngredientState = ingredientData ?? {
    department: "",
    image: "",
    name: "",
    quantity: "",
    unit: "units",
    estimatedCost: 0,
    expirationDate: null,
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
      case "setInput":
        return { ...state, [action.ingredientField]: action.value };
      case "setDate":
        return { ...state, expirationDate: action.value ?? null };
    }
  }

  const [newIngredientData, dispatch] = useReducer(
    reducer,
    initialIngredientState
  );

  return (
    <Modal open={modalOpen} onClose={onClose}>
      <Box sx={GPModalStyle}>
        <form className="ingredient-form">
          <TextField
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
            value={newIngredientData?.name}
            label="Ingredient Name"
            variant="standard"
          />
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
          <Button type="submit" className="add-button">
            {ingredientData ? "Edit Ingredient!" : "Add Ingredient!"}
          </Button>
        </form>
      </Box>
    </Modal>
  );
};

export default IngredientModal;
