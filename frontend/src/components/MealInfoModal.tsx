import React from "react";
import "../styles/Meal.css";
import { GPModalStyle } from "../utils/utils";
import type { GPRecipeDataTypes } from "../utils/types";
import { v4 as uuidv4 } from "uuid";
import {
  Modal,
  Typography,
  Sheet,
  List,
  ListItem,
  ListItemContent,
  Box,
} from "@mui/joy";
import DietsAndIntolerances from "./DietsAndIntolerances";

type GPMealModalProps = {
  modalOpen: boolean;
  handleModalClose: () => void;
  recipeInfo: GPRecipeDataTypes | undefined;
};

const MealInfoModal: React.FC<GPMealModalProps> = ({
  handleModalClose,
  modalOpen,
  recipeInfo,
}) => {
  return (
    //click on card to view more able to see more information about recipe (ingredients needed, steps, etc)
    <Modal
      open={modalOpen}
      onClose={handleModalClose}
      sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}
    >
      <Sheet variant="outlined" sx={GPModalStyle}>
        <Box className="modal-header">
          <img className="meal-img" src={recipeInfo?.previewImage} />
          <Box className="meal-info">
            <Typography level="h2">{recipeInfo?.recipeTitle}</Typography>
            <Typography>Servings: {recipeInfo?.servings}</Typography>
            <DietsAndIntolerances recipeInfo={recipeInfo}/>
          </Box>
        </Box>
        <Typography level="h3">Ingredients</Typography>
        <List marker="circle">
          {recipeInfo?.ingredients.map((ingredient) => {
            return (
              <ListItem className="recipe-modal-ingredient" key={ingredient.id}>
                <ListItemContent
                  sx={{ display: "flex", justifyContent: "space-between" }}
                >
                  <Typography>{ingredient.ingredientName}</Typography>
                  <Typography>
                    {ingredient.quantity % 1 === 0
                      ? ingredient.quantity
                      : ingredient.quantity.toFixed(2)}{" "}
                    {ingredient.unit}
                  </Typography>
                </ListItemContent>
              </ListItem>
            );
          })}
        </List>
        <Typography level="h3">Instructions</Typography>
        <List component="ol" marker="decimal">
          {recipeInfo?.instructions.map((step) => {
            return <ListItem key={uuidv4()}>{step}</ListItem>;
          })}
        </List>
      </Sheet>
    </Modal>
  );
};

export default MealInfoModal;
