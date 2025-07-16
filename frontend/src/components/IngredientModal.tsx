import React from "react";
import { useReducer } from "react";
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
import {
  Button,
  Box,
  Modal,
  FormControl,
  FormLabel,
  Input,
  Select,
  Option,
  FormHelperText,
} from "@mui/joy";
import InfoOutlined from "@mui/icons-material/InfoOutlined";

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
  const [ingredientInputError, setIngredientInputError] = useState(false);

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
        if (ingredientData.quantity && ingredientData.quantity <= 0) {
          setMessage({
            error: true,
            message: "Quantity must be greater than 0",
          });
          return;
        }
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
        <form onSubmit={handleModalSubmit}>
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
              />
            </FormControl>
          )}
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <FormControl error={ingredientInputError}>
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
                onChange={(event) => {
                  setIngredientInputError(parseFloat(event.target.value) <= 0);
                  dispatch({
                    type: actions.SET_INPUT,
                    ingredientField: event?.target
                      .name as keyof GPIngredientDataTypes,
                    value: event.target.value,
                  });
                }}
                value={newIngredientData?.quantity}
              />
              {ingredientInputError && (
                <FormHelperText>
                  <InfoOutlined />
                  Quantity must be greater than 0
                </FormHelperText>
              )}
            </FormControl>
            <FormControl>
              <FormLabel>Unit</FormLabel>
              <Select
                required
                name={IngredientDataFields.UNIT}
                value={newIngredientData?.unit}
                onChange={(event, newValue) =>
                  dispatch({
                    type: actions.SET_INPUT,
                    ingredientField: "unit",
                    value: newValue ?? "",
                  })
                }
                slotProps={{
                  listbox: {
                    sx: {
                      zIndex: 2000,
                    },
                  },
                }}
              >
                {IngredientUnitOptions.map((unit) => (
                  <Option key={unit} value={unit}>
                    {unit}
                  </Option>
                ))}
              </Select>
            </FormControl>
          </Box>
          {modalFor === INGREDIENT_MODAL && (
            <FormControl>
              <FormLabel>Expiration Date</FormLabel>
              <Input
                required
                sx={{ mt: 1.5, mb: 1.5, width: "100%" }}
                type="date"
                slotProps={{
                  input: {
                    "data-ingredientfield":
                      IngredientDataFields.EXPIRATION_DATE,
                  },
                }}
                name={IngredientDataFields.EXPIRATION_DATE}
                value={newIngredientData?.expirationDate ?? ""}
                onChange={(event) =>
                  dispatch({
                    type: actions.SET_INPUT,
                    ingredientField: event?.target
                      .name as keyof GPIngredientDataTypes,
                    value: event.target.value,
                  })
                }
              />
            </FormControl>
          )}
          {isEditing ? (
            <FormControl>
              <FormLabel>Department</FormLabel>
              <Select
                disabled
                name={IngredientDataFields.DEPARTMENT}
                value={newIngredientData?.department}
                slotProps={{
                  listbox: {
                    sx: {
                      zIndex: 2000,
                    },
                  },
                }}
              >
                {Departments.map((department) => (
                  <Option key={department} value={department}>
                    {department}
                  </Option>
                ))}
              </Select>
            </FormControl>
          ) : (
            <FormControl>
              <FormLabel>Department</FormLabel>
              <Select
                required
                name={IngredientDataFields.DEPARTMENT}
                value={newIngredientData?.department}
                onChange={(event, newValue) =>
                  dispatch({
                    type: actions.SET_INPUT,
                    ingredientField: "department",
                    value: newValue ?? "",
                  })
                }
                slotProps={{
                  listbox: {
                    sx: {
                      zIndex: 2000,
                    },
                  },
                }}
              >
                {Departments.map((department) => (
                  <Option key={department} value={department}>
                    {department}
                  </Option>
                ))}
              </Select>
            </FormControl>
          )}
          <Button
            disabled={ingredientInputError}
            type="submit"
            sx={{ display: "flex", mx: "auto", mt: 2 }}
          >
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
