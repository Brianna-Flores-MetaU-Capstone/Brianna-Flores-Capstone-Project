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
  Checkbox,
} from "@mui/joy";
import RecipeCostModal from "./RecipeCostModal";
import DietsAndIntolerances from "./DietsAndIntolerances";
import { estimateRecipeCost } from "../utils/utils";
import { fetchUserIngredientsHelper } from "../utils/databaseHelpers";
import type { GPErrorMessageTypes } from "../utils/types";

type GPMealCardProps = {
  index: number;
  onMealCardClick: () => void;
  parsedMealData: GPRecipeDataTypes;
  setMessage: (
    value: React.SetStateAction<GPErrorMessageTypes | undefined>
  ) => void;
  onSelectRecipe?: (data: GPRecipeDataTypes) => void;
  onDeleteRecipe?: (data: GPRecipeDataTypes) => void;
  onLoadRecipes?: (data: GPRecipeDataTypes, index: number) => void;
  selected: boolean;
  onCompareSelect?: (data: GPRecipeDataTypes) => void;
};

const MealCard: React.FC<GPMealCardProps> = ({
  index,
  onMealCardClick,
  parsedMealData,
  setMessage,
  onSelectRecipe,
  onDeleteRecipe,
  onLoadRecipes,
  selected,
  onCompareSelect,
}) => {
  const [ingredientCostModalOpen, setIngredientCostModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const toggleModal = () => {
    setIngredientCostModalOpen((prev) => !prev);
  };

  const handleCostEstimateClick = async () => {
    setLoading(true);
    const ownedIngredients = await fetchUserIngredientsHelper({
      setMessage: setMessage,
    });
    const estimatedRecipeCostInfo = await estimateRecipeCost({
      ownedIngredients,
      recipeIngredients: parsedMealData.ingredients,
    });
    // update list of meal data
    const updatedRecipeInfo = {
      ...parsedMealData,
      ingredientCostInfo: estimatedRecipeCostInfo.ingredientCostInfo,
      totalCost: estimatedRecipeCostInfo.estimatedCost,
    };
    if (onLoadRecipes) {
      onLoadRecipes(updatedRecipeInfo, index);
    }
    setLoading(false);
    toggleModal();
  };

  return (
    // click on card to view more able to see more information about recipe (ingredients needed, steps, etc)
    <>
      {/* Code referenced from MUI Joy Documentation https://mui.com/joy-ui/react-card/#interactive-card*/}
      <Card
        variant="outlined"
        sx={{ minHeight: "280px", width: 350 }}
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
        {onCompareSelect && (
          <Checkbox
            sx={{ zIndex: 5 }}
            checked={selected}
            onClick={(event) => {
              event.stopPropagation();
              onCompareSelect(parsedMealData);
            }}
          />
        )}
        <CardContent sx={{ justifyContent: "flex-end" }}>
          {onSelectRecipe && (
            <DietsAndIntolerances recipeInfo={parsedMealData} />
          )}
          <Typography textColor="#fff" level="h4">
            {parsedMealData.recipeTitle}
          </Typography>
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Typography textColor="neutral.300">
              Servings: {parsedMealData.servings}
            </Typography>
            {onSelectRecipe && parsedMealData.totalCost > 0 && (
              <Typography textColor="neutral.300">
                Estimated Cost: ${parsedMealData.totalCost.toFixed(2)}
              </Typography>
            )}
            {onDeleteRecipe && (
              <Button
                variant="plain"
                size="lg"
                onClick={(event) => {
                  event.stopPropagation();
                  onDeleteRecipe?.(parsedMealData);
                }}
                sx={{ zIndex: 1 }}
              >
                <FontAwesomeIcon icon={faTrash} />
              </Button>
            )}
          </Box>
          <Link overlay underline="none"></Link>
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            {onSelectRecipe && (
              <Button
                onClick={() => {
                  setMessage({
                    error: false,
                    message: `Added ${parsedMealData.recipeTitle} to selected meals!`,
                  });
                  onSelectRecipe(parsedMealData);
                }}
                sx={{ color: "primary.50" }}
              >
                Select Recipe
              </Button>
            )}
            {onSelectRecipe && parsedMealData.totalCost > 0 && (
              <Button
                onClick={toggleModal}
                sx={{ zIndex: 1, color: "primary.50" }}
              >
                See Pricing Details
              </Button>
            )}
            {onSelectRecipe && parsedMealData.totalCost <= 0 && (
              <Button
                loading={loading}
                sx={{ zIndex: 1, color: "primary.50" }}
                onClick={handleCostEstimateClick}
              >
                Get Estimated Cost
              </Button>
            )}
          </Box>
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
