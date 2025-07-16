import React from "react";
import type { GPIngredientCostInfoTypes } from "../../../backend/utils/utils";
import TitledListView from "./TitledListView";
import IngredientCost from "./IngredientCost";
import { v4 as uuidv4 } from "uuid";
import "../styles/NewListPage.css";
import { Box, Modal, ModalClose, Typography, Sheet } from "@mui/joy";

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
          width: "80%",
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
        <Box sx={{width: "100%", overflowY: "auto"}}>
        <TitledListView
          headerList={[{title: "Ingredient", spacing: 8}, {title: "Cost", spacing: 2}, {title: "for Amount", spacing: 2}]}
          list={ingredientsCostInformation}
          renderItem={(ingredientInfo) => (
            <IngredientCost
              key={uuidv4()}
              ingredientCostInfo={ingredientInfo}
            />
          )}
        />
        </Box>
      </Sheet>
    </Modal>
  );
};

export default RecipeCostModal;
