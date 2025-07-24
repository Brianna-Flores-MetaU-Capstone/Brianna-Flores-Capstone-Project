import React from "react";
import {
  GPMealInfoModalTitleStyle,
  GPModalStyle,
} from "../../utils/style/UIStyle";
import type { GPErrorMessageTypes } from "../../utils/types/types";
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
import { GPCenteredBoxStyle } from "../../utils/style/UIStyle";
import { fetchSingleRecipe } from "../../utils/databaseHelpers";
import { useState } from "react";
import DiffOriginalRecipe from "../recipeDiff/DiffOriginalRecipe";
import { Recipe } from "../../../../shared/Recipe";
import UserDiffOptions from "../recipeDiff/UserDiffOptions";

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
  const [userDiffOptionsOpen, setUserDiffOptionsOpen] = useState(false);
  const [userDiffChoices, setUserDiffChoices] = useState<Set<string>>(
    new Set(),
  );
  const [noDiffFields, setNoDiffFields] = useState<Set<string>>(new Set());

  const onCompareWithOriginal = () => {
    setUserDiffOptionsOpen(true);
  };

  const onSubmitUserDiffOptions = async (
    userChoices: Set<string>,
    noDiffFields: Set<string>,
  ) => {
    // we are viewing the edited recipe, need to fetch original recipe
    setUserDiffOptionsOpen(false);
    if (!recipeInfo) {
      setMessage({
        error: true,
        message: "Error no recipe info set",
      });
      return;
    }
    setUserDiffChoices(userChoices);
    setNoDiffFields(noDiffFields);
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
            <AspectRatio ratio="1"  sx={{ maxWidth: 300, width: 300, borderRadius: "md" }}>
              <img src={recipeInfo?.previewImage[0]} />
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
          userDiffChoices={[...userDiffChoices]}
          noDiffFields={[...noDiffFields]}
        />
      )}
      <UserDiffOptions
        modalOpen={userDiffOptionsOpen}
        toggleModal={() => setUserDiffOptionsOpen((prev) => !prev)}
        onSubmit={onSubmitUserDiffOptions}
      />
    </>
  );
};

export default MealInfoModal;
