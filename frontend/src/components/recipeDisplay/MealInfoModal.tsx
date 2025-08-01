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
import ImageCarousel from "./ImageCarousel";
import { useUser } from "../../contexts/UserContext";
import EditRecipeModal from "../editRecipe/EditRecipeModal";

type GPMealModalProps = {
  modalOpen: boolean;
  toggleModal: () => void;
  recipeInfo: Recipe | undefined;
  refreshRecipes?: () => void;
};

const MealInfoModal: React.FC<GPMealModalProps> = ({
  toggleModal,
  modalOpen,
  recipeInfo,
  refreshRecipes,
}) => {
  const [_, setMessage] = useState<GPErrorMessageTypes>();
  const [diffModalOpen, setDiffModalOpen] = useState(false);
  const [originalRecipeInfo, setOriginalRecipeInfo] = useState<Recipe>();
  const [userDiffOptionsOpen, setUserDiffOptionsOpen] = useState(false);
  const [userDiffChoices, setUserDiffChoices] = useState<Set<string>>(
    new Set()
  );
  const [noDiffFields, setNoDiffFields] = useState<Set<string>>(new Set());
  const [editRecipeModalOpen, setEditRecipeModalOpen] = useState(false);
  const { user } = useUser();

  const onCompareWithOriginal = () => {
    setUserDiffOptionsOpen(true);
  };

  const onSubmitUserDiffOptions = async (
    userChoices: Set<string>,
    noDiffFields: Set<string>
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

  const onSubstituteClick = () => {
    setEditRecipeModalOpen(true);
    toggleModal();
  };

  const handleCreateSubstitutionRecipe = () => {
    setEditRecipeModalOpen(false);
    refreshRecipes && refreshRecipes();
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
          <ImageCarousel imageUrls={recipeInfo?.previewImage ?? []} />
          <Box sx={GPMealInfoModalTitleStyle}>
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
              <Typography>
                Original creator: {recipeInfo?.originalSource}
              </Typography>
              <Typography>Servings: {recipeInfo?.servings}</Typography>
              <DietsAndIntolerances recipeInfo={recipeInfo} />
              <Link href={recipeInfo?.sourceUrl} startDecorator={<LinkIcon />}>
                Recipe link
              </Link>
            </Box>
          </Box>
          <Box>
            <Typography level="h3">Ingredients</Typography>
            {user && (
              <Button onClick={onSubstituteClick}>
                Get Ingredient Substitutions For Diet
              </Button>
            )}
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
                    {ingredient.subIngredients && (
                      <List sx={{ ml: 4 }} marker="disc">
                        {ingredient.subIngredients.map((subIngredient) => (
                          <ListItem key={subIngredient.ingredientName}>
                            <Box sx={{display: "flex", justifyContent: "space-between"}}>
                              <Typography>
                                {subIngredient.ingredientName}
                              </Typography>
                              <Typography>
                                {subIngredient.quantity % 1 === 0
                                  ? subIngredient.quantity
                                  : Number(subIngredient.quantity).toFixed(
                                      2
                                    )}{" "}
                                {subIngredient.unit}
                              </Typography>
                            </Box>
                          </ListItem>
                        ))}
                      </List>
                    )}
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
      <EditRecipeModal
        getDietarySubstitutes={true}
        modalOpen={editRecipeModalOpen}
        toggleModal={() => setEditRecipeModalOpen((prev) => !prev)}
        recipe={recipeInfo}
        onSubmit={handleCreateSubstitutionRecipe}
      />
    </>
  );
};

export default MealInfoModal;
