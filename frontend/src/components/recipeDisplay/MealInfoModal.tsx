import React from "react";
import { GPMealInfoModalTitleStyle, GPModalStyle } from "../../utils/UIStyle";
import type { GPErrorMessageTypes } from "../../utils/types";
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
import { GPCenteredBoxStyle } from "../../utils/UIStyle";
import { fetchSingleRecipe } from "../../utils/databaseHelpers";
import { useState } from "react";
import DiffOriginalRecipe from "../recipeDiff/DiffOriginalRecipe";
import { Recipe } from "../../classes/recipe/Recipe";

type GPMealModalProps = {
  modalOpen: boolean;
  toggleModal: () => void;
  recipeInfo: Recipe | undefined;
};

const MealInfoModal: React.FC<GPMealModalProps> = ({
  toggleModal,
  modalOpen,
  recipeInfo,
}) => {
  const [message, setMessage] = useState<GPErrorMessageTypes>();
  const [diffModalOpen, setDiffModalOpen] = useState(false);
  const [originalRecipeInfo, setOriginalRecipeInfo] = useState<Recipe>();

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
    setOriginalRecipeInfo(originalRecipe);
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
          <Box sx={GPMealInfoModalTitleStyle}>
            <AspectRatio ratio="1" sx={{ width: 700, borderRadius: "md" }}>
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
      {originalRecipeInfo && recipeInfo && (
        <DiffOriginalRecipe
          originalRecipeInfo={originalRecipeInfo}
          editedRecipeInfo={recipeInfo}
          modalOpen={diffModalOpen}
          setModalOpen={() => setDiffModalOpen((prev) => !prev)}
          fineGrainedDiff={true}
          userDiffChoices={[]}
        />
      )}
    </>
  );
};

export default MealInfoModal;
