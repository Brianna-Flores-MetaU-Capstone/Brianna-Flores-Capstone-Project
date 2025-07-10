import React from "react";
import Modal from "@mui/joy/Modal";
import ModalClose from "@mui/joy/ModalClose";
import Typography from "@mui/joy/Typography";
import Sheet from "@mui/joy/Sheet";
import { ModalDialog } from "@mui/joy";
import type { GPIngredientPriceInfoTypes } from "../../../backend/utils/utils";
import GenericList from "./GenericList";
import IngredientPrice from "./IngredientPrice";
import { v4 as uuidv4 } from "uuid";
import "../styles/NewListPage.css";

type GPLoadingModalTypes = {
  ingredientsPriceInformation: GPIngredientPriceInfoTypes[];
  modalOpen: boolean;
  onClose: () => void;
};
const RecipeCostModal = ({
  ingredientsPriceInformation,
  modalOpen,
  onClose,
}: GPLoadingModalTypes) => {
  return (
    // Code based on MUI documentation: https://mui.com/joy-ui/react-modal/
    <Modal
      aria-labelledby="Loading"
      aria-describedby="loading screen"
      open={modalOpen}
      onClose={onClose}
      sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}
    >
      <Sheet
        variant="outlined"
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 3,
          width: "70%",
          maxWidth: 700,
          borderRadius: "md",
          p: 3,
          boxShadow: "lg",
          height: "50%",
        }}
      >
        <ModalClose variant="plain" sx={{ m: 1 }} />
        <Typography
          component="h2"
          id="modal-title"
          level="h4"
          textColor="inherit"
          sx={{ fontWeight: "lg", mb: 1 }}
        >
          Ingredient Price Information
        </Typography>
        <GenericList
          className="ingredient-price-info"
          headerList={["Ingredient", "Price", "for Amount"]}
          list={ingredientsPriceInformation}
          renderItem={(ingredientInfo) => (
            <IngredientPrice
              key={uuidv4()}
              ingredientPriceInfo={ingredientInfo}
            />
          )}
        />
      </Sheet>
    </Modal>
  );
};

export default RecipeCostModal;
