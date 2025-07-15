import React from "react";
import "../styles/Meal.css";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import { GPModalStyle } from "../utils/utils";
import type { GPRecipeDataTypes } from "../utils/types";
import { v4 as uuidv4 } from "uuid";

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
    <Modal open={modalOpen} onClose={handleModalClose}>
      <Box sx={GPModalStyle}>
        <div className="modal-header">
          <img className="meal-img" src={recipeInfo?.previewImage} />
          <div className="meal-info">
            <h2>{recipeInfo?.recipeTitle}</h2>
            <p>Servings: {recipeInfo?.servings}</p>
            <p>Estimated Cost: ${recipeInfo?.totalCost}</p>
            <ul className="diets-and-intolerances">
              {recipeInfo?.dairyFree && <li>Dairy Free</li>}
              {recipeInfo?.glutenFree && <li>Gluten Free</li>}
              {recipeInfo?.vegetarian && <li>Vegetarian</li>}
              {recipeInfo?.vegan && <li>Vegan</li>}
            </ul>
          </div>
        </div>
        <h4>Ingredients</h4>
        {recipeInfo?.ingredients.map((ingredient) => {
          return (
            <div className="recipe-modal-ingredient" key={ingredient.id}>
              <p>{ingredient.ingredientName}</p>
              <p>{ingredient.quantity}</p>
              <p>{ingredient.unit}</p>
            </div>
          );
        })}
        <h4>Instructions</h4>
        <ol>
          {recipeInfo?.instructions.map((step) => {
            return <li key={uuidv4()}>{step}</li>;
          })}
        </ol>
      </Box>
    </Modal>
  );
};

export default MealInfoModal;
