import "../styles/Meal.css";
import type { GPRecipeDataTypes } from "../utils/types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
import { AspectRatio, Button, Card, Link, Typography } from "@mui/joy";
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
    <Card variant="outlined" sx={{justifyContent: "space-between", width: 200}} onClick={() => onMealCardClick()}>
      <AspectRatio minHeight="120px" ratio="1">
        <img src={parsedMealData.previewImage} />
      </AspectRatio>
      <Typography textAlign="center" level="h4">{parsedMealData.recipeTitle}</Typography>
      <Typography textAlign="center">Servings: {parsedMealData.servings}</Typography>
      <Link overlay underline="none"></Link>
      {onSelectRecipe && (
        <Typography>Estimated Cost: ${parsedMealData.totalCost.toFixed(2)}</Typography>
      )}
      <DietsAndIntolerances recipeInfo={parsedMealData} />
      {onDeleteRecipe && (
        <Button onClick={(event) => {
          event.stopPropagation()
          onDeleteRecipe?.(parsedMealData)
        }}
        sx={{alignItems: "right"}}>
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
    </Card>
  );
};

export default MealCard;
