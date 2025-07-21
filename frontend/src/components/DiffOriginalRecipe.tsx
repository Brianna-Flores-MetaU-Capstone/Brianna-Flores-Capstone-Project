import { useState, useEffect } from "react";
import type { GPErrorMessageTypes, GPRecipeDataTypes } from "../utils/types";
import type { GPDiffLineInfoType } from "../utils/diffUtils";
import {
  AspectRatio,
  List,
  ListItem,
  Box,
  Modal,
  ModalClose,
  ModalDialog,
  DialogContent,
  Typography,
} from "@mui/joy";

import { DiffRecipes } from "../classes/DiffRecipe";
import DiffOriginalContentDisplay from "./DiffOriginalContentDisplay";

type GPDiffOriginalType = {
  originalRecipeInfo: GPRecipeDataTypes;
  editedRecipeInfo: GPRecipeDataTypes;
  modalOpen: boolean;
  setModalOpen: () => void;
};

type GPOriginalRecipeDiffType = {
  titleDiffResults: GPDiffLineInfoType[];
  servingsDiffResults: GPDiffLineInfoType[];
  ingredientsDiffResults: GPDiffLineInfoType[];
  instructionsDiffResults: GPDiffLineInfoType[];
};

const DiffOriginalRecipe = ({
  originalRecipeInfo,
  editedRecipeInfo,
  modalOpen,
  setModalOpen,
}: GPDiffOriginalType) => {
  const [recipeDiffInfo, setRecipeDiffInfo] =
    useState<GPOriginalRecipeDiffType>();
  const [message, setMessage] = useState<GPErrorMessageTypes>();

  useEffect(() => {
    const recipeDiff = new DiffRecipes(originalRecipeInfo, editedRecipeInfo);
    const recipeDiffInfo = recipeDiff.getRecipeDiff();
    setRecipeDiffInfo(recipeDiffInfo);
    console.log(recipeDiffInfo);
  }, [modalOpen]);

  return (
    <Modal
      aria-labelledby="modal-title"
      aria-describedby="modal-desc"
      open={modalOpen}
      onClose={setModalOpen}
    >
      <ModalDialog layout="fullscreen">
        <ModalClose variant="plain" sx={{ zIndex: 2, m: 1 }} />
        <DialogContent sx={{ my: 4 }}>
          <AspectRatio ratio="1" sx={{ width: "20%", borderRadius: "md" }}>
            <img src={originalRecipeInfo.previewImage} />
          </AspectRatio>
          {recipeDiffInfo && (
            <DiffOriginalContentDisplay
              xDiffResults={recipeDiffInfo.titleDiffResults}
              parentComponent={Box}
              childrenComponent={Typography}
              childComponentProps={{ level: "h2" }}
            />
          )}
          <Typography>Servings: </Typography>
          {recipeDiffInfo && (
            <DiffOriginalContentDisplay
              xDiffResults={recipeDiffInfo.servingsDiffResults}
              parentComponent={Box}
              childrenComponent={Typography}
              childComponentProps={{ level: "" }}
            />
          )}
          <Typography level="h3">Ingredients</Typography>
          {recipeDiffInfo && (
            <DiffOriginalContentDisplay
              xDiffResults={recipeDiffInfo.ingredientsDiffResults}
              parentComponent={List}
              parentComponentProps={{ marker: "circle" }}
              childrenComponent={ListItem}
            />
          )}
          <Typography level="h3">Instructions</Typography>
          {recipeDiffInfo && (
            <DiffOriginalContentDisplay
              xDiffResults={recipeDiffInfo.instructionsDiffResults}
              parentComponent={List}
              parentComponentProps={{ marker: "decimal" }}
              childrenComponent={ListItem}
            />
          )}
        </DialogContent>
      </ModalDialog>
    </Modal>
  );
};

export default DiffOriginalRecipe;
