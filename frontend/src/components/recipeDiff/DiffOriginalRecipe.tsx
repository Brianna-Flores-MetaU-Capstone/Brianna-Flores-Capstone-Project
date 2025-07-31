import { useState, useEffect } from "react";
import { DiffStatus, type GPDiffLineInfoType } from "../../utils/diffUtils";
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
} from "../../utils/style/UIStyle";
import MealInfoModal from "../recipeDisplay/MealInfoModal";
import type { Recipe } from "../../../../shared/Recipe";
import { GPDiffOptionsEnum } from "../../classes/recipeDiffClasses/DiffRecipes";

type GPDiffOriginalType = {
  originalRecipeInfo: Recipe;
  editedRecipeInfo: Recipe;
  modalOpen: boolean;
  setModalOpen: () => void;
  userDiffChoices: string[];
  noDiffFields: string[];
};

type GPOriginalRecipeDiffType = {
  titleDiffResults?: GPDiffLineInfoType[];
  servingsDiffResults?: GPDiffLineInfoType[];
  tagsDiffResults?: GPDiffLineInfoType[];
  cookTimeDiffResults?: GPDiffLineInfoType[];
  ingredientsDiffResults?: GPDiffLineInfoType[];
  instructionsDiffResults?: GPDiffLineInfoType[];
  imageDiffResults?: GPDiffLineInfoType[];
};

const DiffOriginalRecipe = ({
  originalRecipeInfo,
  editedRecipeInfo,
  modalOpen,
  setModalOpen,
  userDiffChoices,
  noDiffFields,
}: GPDiffOriginalType) => {
  const [recipeDiffInfo, setRecipeDiffInfo] =
    useState<GPOriginalRecipeDiffType>();
  const [viewOriginalModalOpen, setViewOriginalModalOpen] = useState(false);

  useEffect(() => {
    const recipeDiff = new DiffRecipes(originalRecipeInfo, editedRecipeInfo);
    // user requested to get diff of all fields, just call get full recipe diff
    if (userDiffChoices.length === Object.values(GPDiffOptionsEnum).length) {
      const recipeDiffInfo = recipeDiff.getFullRecipeDiff();
      setRecipeDiffInfo(recipeDiffInfo);
    } else {
      // otherwise diff only requested fields
      const recipeDiffInfo = recipeDiff.getRequestedDiff(
        userDiffChoices,
        noDiffFields
      );
      setRecipeDiffInfo(recipeDiffInfo);
    }
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
            <Box sx={{ display: "flex" }}>
              {recipeDiffInfo?.imageDiffResults?.map((image, index) => {
                console.log(image);
                return (
                  <AspectRatio
                    key={index}
                    ratio="1"
                    sx={{
                      ...(image.status === DiffStatus.ADDED ||
                      image.status === DiffStatus.DELETED
                        ? {
                            border: 5,
                            ...(image.status === DiffStatus.ADDED
                              ? { borderColor: "success.200" }
                              : { borderColor: "danger.200" }),
                          }
                        : {}),
                      width: 350,
                      borderRadius: "md",
                      mx: 1,
                    }}
                  >
                    <img src={image.line} />
                  </AspectRatio>
                );
              })}
            </Box>
            <Box sx={GPMealInfoModalTitleStyle}>
              <Box sx={GPCenteredBoxStyle}>
                {recipeDiffInfo?.titleDiffResults && (
                  <DiffOriginalContentDisplay
                    xDiffResults={recipeDiffInfo.titleDiffResults ?? []}
                    parentComponent={Box}
                    childrenComponent={Typography}
                    childComponentProps={{ level: "h2" }}
                  />
                )}
                <Typography level="h4">
                  Original Creator: {editedRecipeInfo.originalSource}
                </Typography>
                <Typography level="h4">
                  Edited By: {editedRecipeInfo.editingAuthorName}
                </Typography>
                <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
                  <Typography>Servings:</Typography>
                  {recipeDiffInfo?.servingsDiffResults && (
                    <DiffOriginalContentDisplay
                      xDiffResults={recipeDiffInfo.servingsDiffResults ?? []}
                      parentComponent={Box}
                      childrenComponent={Typography}
                    />
                  )}
                </Box>
                <Box sx={{ display: "flex", gap: 0.5, alignItems: "center" }}>
                  <Typography>Cook Time:</Typography>
                  {recipeDiffInfo?.cookTimeDiffResults && (
                    <DiffOriginalContentDisplay
                      xDiffResults={recipeDiffInfo.cookTimeDiffResults ?? []}
                      parentComponent={Box}
                      childrenComponent={Typography}
                    />
                  )}
                  <Typography>minutes</Typography>
                </Box>
                {recipeDiffInfo?.tagsDiffResults && (
                  <DiffOriginalContentDisplay
                    xDiffResults={recipeDiffInfo.tagsDiffResults ?? []}
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
            {recipeDiffInfo?.ingredientsDiffResults && (
              <DiffOriginalContentDisplay
                xDiffResults={recipeDiffInfo.ingredientsDiffResults ?? []}
                parentComponent={List}
                parentComponentProps={{ marker: "circle" }}
                childrenComponent={ListItem}
              />
            )}
            <Typography level="h3">Instructions</Typography>
            {recipeDiffInfo?.instructionsDiffResults && (
              <DiffOriginalContentDisplay
                xDiffResults={recipeDiffInfo.instructionsDiffResults ?? []}
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
