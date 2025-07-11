import React from "react";
import Modal from "@mui/joy/Modal";
import ModalClose from "@mui/joy/ModalClose";
import Typography from "@mui/joy/Typography";
import Sheet from "@mui/joy/Sheet";
import type { GPIngredientCostInfoTypes } from "../../../backend/utils/utils";
import TitledListView from "./TitledListView";
import IngredientCost from "./IngredientCost";
import { v4 as uuidv4 } from "uuid";
import "../styles/NewListPage.css";

type GPLoadingModalTypes = {
  ingredientsCostInformation: GPIngredientCostInfoTypes[];
  modalOpen: boolean;
  onClose: () => void;
};
const RecipeCostModal = ({
  ingredientsCostInformation,
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
        className="recipe-cost-modal"
        variant="outlined"
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
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
          level="h2"
          textColor="inherit"
          sx={{ fontWeight: "lg", mb: 1 }}
        >
          Ingredient Cost Information
        </Typography>
        <TitledListView
          className="ingredient-cost-info"
          headerList={["Ingredient", "Cost", "for Amount"]}
          list={ingredientsCostInformation}
          renderItem={(ingredientInfo) => (
            <IngredientCost
              key={uuidv4()}
              ingredientCostInfo={ingredientInfo}
            />
          )}
        />
      </Sheet>
    </Modal>
  );
};

export default RecipeCostModal;
