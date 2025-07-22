import { useState, useEffect } from "react";
import type { GPErrorMessageTypes } from "../../utils/types";
import type { GPDiffLineInfoType } from "../../utils/diffUtils";
import {
  AspectRatio,
  List,
  ListItem,
  Button,
  Box,
  Modal,
  ModalClose,
  ModalDialog,
  DialogContent,
  Typography,
} from "@mui/joy";

import { DiffRecipes } from "../../classes/recipeDiffClasses/DiffRecipes";
import DiffOriginalContentDisplay from "./DiffOriginalContentDisplay";
import {
  GPCenteredBoxStyle,
  GPMealInfoModalTitleStyle,
  GPTagItemStyle,
} from "../../utils/UIStyle";
import MealInfoModal from "../recipeDisplay/MealInfoModal";
import type { Recipe } from "../../classes/recipe/Recipe";

type GPDiffOriginalType = {
  originalRecipeInfo: Recipe;
  editedRecipeInfo: Recipe;
  modalOpen: boolean;
  setModalOpen: () => void;
};

type GPOriginalRecipeDiffType = {
  titleDiffResults: GPDiffLineInfoType[];
  servingsDiffResults: GPDiffLineInfoType[];
  tagsDiffResults: GPDiffLineInfoType[];
  cookTimeDiffResults: GPDiffLineInfoType[];
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
  const [viewOriginalModalOpen, setViewOriginalModalOpen] = useState(false);

  useEffect(() => {
    const recipeDiff = new DiffRecipes(originalRecipeInfo, editedRecipeInfo);
    const recipeDiffInfo = recipeDiff.getRecipeDiff();
    setRecipeDiffInfo(recipeDiffInfo);
  }, [modalOpen]);

  const handleViewOriginalRecipe = () => {
    setModalOpen();
    setViewOriginalModalOpen(true);
  };

  return (
    <>
      <Modal
        aria-labelledby="modal-title"
        aria-describedby="modal-desc"
        open={modalOpen}
        onClose={setModalOpen}
      >
        <ModalDialog layout="fullscreen">
          <ModalClose variant="plain" sx={{ zIndex: 2, m: 1 }} />
          <DialogContent sx={{ m: 4 }}>
            <Box sx={GPMealInfoModalTitleStyle}>
              <AspectRatio ratio="1" sx={{ width: 350, borderRadius: "md" }}>
                <img src={originalRecipeInfo.previewImage} />
              </AspectRatio>
              <Box sx={GPCenteredBoxStyle}>
                {recipeDiffInfo && (
                  <DiffOriginalContentDisplay
                    xDiffResults={recipeDiffInfo.titleDiffResults}
                    parentComponent={Box}
                    childrenComponent={Typography}
                    childComponentProps={{ level: "h2" }}
                  />
                )}
                <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
                  <Typography>Servings:</Typography>
                  {recipeDiffInfo && (
                    <DiffOriginalContentDisplay
                      xDiffResults={recipeDiffInfo.servingsDiffResults}
                      parentComponent={Box}
                      childrenComponent={Typography}
                    />
                  )}
                </Box>
                <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
                  <Typography>Cook Time:</Typography>
                  {recipeDiffInfo && (
                    <DiffOriginalContentDisplay
                      xDiffResults={recipeDiffInfo.cookTimeDiffResults}
                      parentComponent={Box}
                      childrenComponent={Typography}
                    />
                  )}
                </Box>
                {recipeDiffInfo && (
                  <DiffOriginalContentDisplay
                    xDiffResults={recipeDiffInfo.tagsDiffResults}
                    parentComponent={Box}
                    parentComponentProps={{
                      display: "flex",
                      justifyContent: "center",
                    }}
                    childrenComponent={Typography}
                    childComponentProps={GPTagItemStyle}
                  />
                )}
                <Button size="lg" onClick={handleViewOriginalRecipe}>
                  View Original Recipe
                </Button>
              </Box>
            </Box>
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
      <MealInfoModal
        toggleModal={() => setViewOriginalModalOpen((prev) => !prev)}
        modalOpen={viewOriginalModalOpen}
        recipeInfo={originalRecipeInfo}
      />
    </>
  );
};

export default DiffOriginalRecipe;
