import React from "react";
import { GPModalStyle } from "../utils/UIStyle";
import type { GPErrorMessageTypes, GPRecipeDataTypes } from "../utils/types";
import {
  Modal,
  Button,
  Typography,
  Sheet,
  List,
  ListItem,
  ListItemContent,
  Box,
  Link,
  AspectRatio,
} from "@mui/joy";
import PersonIcon from "@mui/icons-material/Person";
import LinkIcon from "@mui/icons-material/Link";
import DietsAndIntolerances from "./DietsAndIntolerances";
import { GPCenteredBoxStyle } from "../utils/UIStyle";
import {
  checkForChangedLines,
  getIngredientsDiff,
  getInstructionsLCS,
} from "../utils/diffUtils";
import type { GPDiffLineInfoType } from "../utils/diffUtils";
import { fetchSingleRecipe } from "../utils/databaseHelpers";
import { useState } from "react";
import DiffOriginalRecipe from "./DiffOriginalRecipe";

type GPMealModalProps = {
  modalOpen: boolean;
  toggleModal: () => void;
  recipeInfo: GPRecipeDataTypes | undefined;
};

const MealInfoModal: React.FC<GPMealModalProps> = ({
  toggleModal,
  modalOpen,
  recipeInfo,
}) => {
  const [message, setMessage] = useState<GPErrorMessageTypes>();
  const [instructionsDiffInfo, setInstructionsDiffInfo] = useState<
    GPDiffLineInfoType[]
  >([]);
  const [ingredientsDiffInfo, setIngredientsDiffInfo] = useState<
    GPDiffLineInfoType[]
  >([]);
  const [diffModalOpen, setDiffModalOpen] = useState(false);

  const onCompareWithOriginal = async () => {
    // we are viewing the edited recipe, need to fetch original recipe
    if (!recipeInfo) {
      setMessage({
        error: true,
        message: "Error no recipe info set",
      });
      return;
    }
    const originalRecipe = await fetchSingleRecipe({
      setMessage,
      selectedRecipe: recipeInfo,
    });
    const diffInstructionLines = getInstructionsLCS({
      instructionsA: originalRecipe.instructions,
      instructionsB: recipeInfo.instructions,
    });
    if (!diffInstructionLines) {
      setMessage({
        error: true,
        message: "Error during diff",
      });
      return;
    }
    const detailedDiffInstruction = checkForChangedLines({
      instructionDifferences: diffInstructionLines,
    });
    setInstructionsDiffInfo(detailedDiffInstruction);
    const ingredientsDiff = getIngredientsDiff({
      recipeA: originalRecipe,
      recipeB: recipeInfo,
    });
    setIngredientsDiffInfo(ingredientsDiff);
    setDiffModalOpen(true);
  };

  return (
    // click on card to view more able to see more information about recipe (ingredients needed, steps, etc)
    <>
      <Modal
        open={modalOpen}
        onClose={toggleModal}
        sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}
      >
        <Sheet variant="outlined" sx={GPModalStyle}>
          <Box sx={{ display: "flex", justifyContent: "space-around" }}>
            <AspectRatio ratio="1" sx={{ width: "50%", borderRadius: "md" }}>
              <img src={recipeInfo?.previewImage} />
            </AspectRatio>
            <Box sx={GPCenteredBoxStyle}>
              <Typography level="h2">{recipeInfo?.recipeTitle}</Typography>
              {recipeInfo?.editingAuthorName && (
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 1,
                  }}
                >
                  <PersonIcon />
                  <Typography>
                    Edited by: {recipeInfo.editingAuthorName}
                  </Typography>
                  <Button onClick={onCompareWithOriginal}>
                    Compare With Original Recipe
                  </Button>
                </Box>
              )}
              <Typography>Servings: {recipeInfo?.servings}</Typography>
              <DietsAndIntolerances recipeInfo={recipeInfo} />
              <Link href={recipeInfo?.sourceUrl} startDecorator={<LinkIcon />}>
                Recipe link
              </Link>
            </Box>
          </Box>
          <Box>
            <Typography level="h3">Ingredients</Typography>
            <List marker="circle">
              {(recipeInfo?.ingredients ?? []).map((ingredient, index) => {
                return (
                  <ListItem key={index}>
                    <ListItemContent
                      sx={{ display: "flex", justifyContent: "space-between" }}
                    >
                      <Typography>{ingredient.ingredientName}</Typography>
                      <Typography>
                        {ingredient.quantity % 1 === 0
                          ? ingredient.quantity
                          : Number(ingredient.quantity).toFixed(2)}{" "}
                        {ingredient.unit}
                      </Typography>
                    </ListItemContent>
                  </ListItem>
                );
              })}
            </List>
            <Typography level="h3">Instructions</Typography>
            <List component="ol" marker="decimal">
              {recipeInfo?.instructions.map((step, index) => {
                return <ListItem key={index}>{step}</ListItem>;
              })}
            </List>
          </Box>
        </Sheet>
      </Modal>
      <DiffOriginalRecipe
        instructionsDiffInfo={instructionsDiffInfo}
        ingredientsDiffInfo={ingredientsDiffInfo}
        modalOpen={diffModalOpen}
        setModalOpen={() => setDiffModalOpen((prev) => !prev)}
      />
    </>
  );
};

export default MealInfoModal;
