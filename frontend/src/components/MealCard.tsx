import "../styles/Meal.css";
import type { GPRecipeDataTypes } from "../utils/types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
import {
  Button,
  Box,
  Card,
  CardContent,
  CardCover,
  Link,
  Typography,
} from "@mui/joy";
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
    <>
    <Card
      variant="outlined"
      sx={{ minHeight: "280px", width: 320 }}
      onClick={() => onMealCardClick()}
    >
      <CardCover>
        <img src={parsedMealData.previewImage} />
      </CardCover>
      <CardCover
        sx={{
          background:
            "linear-gradient(to top, rgba(0,0,0,0.4), rgba(0,0,0,0) 200px), linear-gradient(to top, rgba(0,0,0,0.8), rgba(0,0,0,0) 300px)",
        }}
      />
        <CardContent sx={{ justifyContent: 'flex-end' }}>
          {onSelectRecipe && <DietsAndIntolerances recipeInfo={parsedMealData} />}
          <Typography textColor="#fff" level="h4">
            {parsedMealData.recipeTitle}
          </Typography>
          <Box sx={{display: "flex", justifyContent: "space-between"}}>
            <Typography textColor="neutral.300">
              Servings: {parsedMealData.servings}
            </Typography>
            {onDeleteRecipe && (
              <Button
                variant="plain"
                size="sm"
                onClick={(event) => {
                  event.stopPropagation();
                  onDeleteRecipe?.(parsedMealData);
                }}
                sx={{ zIndex: 1 }}
              >
                <FontAwesomeIcon icon={faTrash} />
              </Button>
            )}
          {onSelectRecipe && (
            <Typography textColor="neutral.300">
              Estimated Cost: ${parsedMealData.totalCost.toFixed(2)}
            </Typography>
          )}
          </Box>
          <Link overlay underline="none"></Link>
      {onSelectRecipe && (
        <Button onClick={toggleModal}>See Pricing Details</Button>
      )}
      {onSelectRecipe && (
        <Button onClick={() => onSelectRecipe(parsedMealData)}>
          Select Recipe
        </Button>
      )}
      </CardContent>
    </Card>
      {ingredientCostModalOpen && (
        <RecipeCostModal
          ingredientsCostInformation={parsedMealData.ingredientCostInfo}
          modalOpen={ingredientCostModalOpen}
          onClose={toggleModal}
        />
      )}
    </>
  );
};

export default MealCard;
