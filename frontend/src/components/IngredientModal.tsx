import React from "react";
import "../styles/IngredientsPage.css";
import { Units, Departments } from "../utils/enum";
import type { GPIngredientDataTypes } from "../utils/types";
import { useState } from "react";
import TextField from "@mui/material/TextField";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import type { SelectChangeEvent } from "@mui/material/Select";
import InputLabel from "@mui/material/InputLabel";
import Button from "@mui/material/Button";
import { ingredientDataFields, INGREDIENT_MODAL } from "../utils/constants";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import { GPModalStyle } from "../utils/utils";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs, { Dayjs } from "dayjs";
import type { PickerValue } from "@mui/x-date-pickers/internals";

interface GPIngredientModalProps {
  modalFor: string;
  ingredientData?: GPIngredientDataTypes;
  onClose: () => void;
  modalOpen: boolean;
}

const IngredientModal: React.FC<GPIngredientModalProps> = ({
  modalFor,
  ingredientData,
  onClose,
  modalOpen,
}) => {
  const [newIngredientData, setNewIngredientData] =
    useState<GPIngredientDataTypes>(
      ingredientData ?? {
        department: "",
        image: "",
        name: "",
        quantity: "",
        unit: "unit",
        estimatedCost: 0,
        expirationDate: "",
      }
    );

  const GBUpdateData = (
    ingredientfield: keyof GPIngredientDataTypes,
    value: any
  ) => {
    setNewIngredientData((prev) => ({ ...prev, [ingredientfield]: value }));
  };

  const handleSelectChange = (event: SelectChangeEvent) => {
    const value = event.target.value;
    const ingredientfield = event.target.name as keyof GPIngredientDataTypes;
    GBUpdateData(ingredientfield, value);
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const ingredientfield = event.target.name as keyof GPIngredientDataTypes;
    const value = event.target.value;
    GBUpdateData(ingredientfield, value);
  };

  const handleDateChange = (newDate: PickerValue) => {
    GBUpdateData("expirationDate", newDate?.format("YYYY-MM-DD") ?? undefined);
  };

  return (
    <Modal open={modalOpen} onClose={onClose}>
      <Box sx={GPModalStyle}>
        <form className="ingredient-form">
          <TextField
            required
            id="ingredient-name"
            name={ingredientDataFields.NAME}
            slotProps={{ htmlInput: { "data-ingredientfield": "name" } }}
            onChange={handleInputChange}
            value={newIngredientData?.name}
            label="Ingredient Name"
            variant="standard"
          />
          <Box display="flex" width="100%">
            <TextField
              required
              id="ingredient-quantity"
              name={ingredientDataFields.QUANTITY}
              slotProps={{ htmlInput: { "data-ingredientfield": "quantity" } }}
              onChange={handleInputChange}
              value={newIngredientData?.quantity}
              fullWidth
              label="Quantity"
              variant="standard"
            />
            <Select
              id="unit"
              name={ingredientDataFields.UNIT}
              value={newIngredientData?.unit}
              onChange={handleSelectChange}
              autoWidth
              label="unit"
            >
              {Units.map((unit) => (
                <MenuItem key={unit} value={unit}>
                  {unit}
                </MenuItem>
              ))}
            </Select>
          </Box>
          {modalFor === INGREDIENT_MODAL && (
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                name={ingredientDataFields.EXPIRATION_DATE}
                label="Expiration Date"
                value={
                  newIngredientData?.expirationDate
                    ? dayjs(newIngredientData?.expirationDate)
                    : null
                }
                onChange={handleDateChange}
              />
            </LocalizationProvider>
          )}
          <InputLabel>Select a Department</InputLabel>
          <Select
            id={ingredientDataFields.DEPARTMENT}
            name={ingredientDataFields.DEPARTMENT}
            value={newIngredientData?.department}
            onChange={handleSelectChange}
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
