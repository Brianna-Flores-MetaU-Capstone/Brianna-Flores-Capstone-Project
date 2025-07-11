import "../styles/Meal.css";
import type { GPRecipeDataTypes } from "../utils/types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
import { Button, Box, Typography } from "@mui/joy";
import RecipeCostModal from "./RecipeCostModal";
import DietsAndIntolerances from "./DietsAndIntolerances";

type GPMealCardProps = {
  onMealCardClick: () => void;
  parsedMealData: GPRecipeDataTypes;
  onSelectRecipe?: (data: GPRecipeDataTypes) => void;
  onDeleteRecipe?: (data: GPRecipeDataTypes) => void;
};

const MealCard: React.FC<GPMealCardProps> = ({
  onMealCardClick,
  parsedMealData,
  onSelectRecipe,
  onDeleteRecipe,
}) => {
  const [ingredientCostModalOpen, setIngredientCostModalOpen] = useState(false);

  const toggleModal = () => {
    setIngredientCostModalOpen((prev) => !prev);
  };

  return (
    //click on card to view more able to see more information about recipe (ingredients needed, steps, etc)
    <Box className="meal-card" onClick={() => onMealCardClick()}>
      <img className="meal-img" src={parsedMealData.previewImage} />
      <Typography className="meal-title">{parsedMealData.recipeTitle}</Typography>
      <Typography>Servings: {parsedMealData.servings}</Typography>
      {onSelectRecipe && (
        <Typography>Estimated Cost: ${parsedMealData.totalCost.toFixed(2)}</Typography>
      )}
      <DietsAndIntolerances recipeInfo={parsedMealData} />
      {onDeleteRecipe && (
        <Button onClick={(event) => {
          event.stopPropagation
          onDeleteRecipe?.(parsedMealData)
        }}
        sx={{textAlign: "right"}}>
        <FontAwesomeIcon
          icon={faTrash}
        />
        </Button>
      )}
      {onSelectRecipe && (
        <Button onClick={toggleModal}>See Pricing Details</Button>
      )}
      {onSelectRecipe && (
        <Button onClick={() => onSelectRecipe(parsedMealData)}>
          Select Recipe
        </Button>
      )}
      {ingredientCostModalOpen && (
        <RecipeCostModal
          ingredientsCostInformation={parsedMealData.ingredientCostInfo}
          modalOpen={ingredientCostModalOpen}
          onClose={toggleModal}
        />
      )}
    </Box>
  );
};

export default MealCard;
