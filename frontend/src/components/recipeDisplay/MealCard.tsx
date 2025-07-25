import type { GPRecipeDataTypes } from "../../utils/types";
import { useState } from "react";
import {
  Button,
  Box,
  Card,
  CardContent,
  Typography,
  Checkbox,
  Tooltip,
  IconButton,
  AspectRatio,
} from "@mui/joy";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import PersonIcon from "@mui/icons-material/Person";
import RecipeCostModal from "./RecipeCostModal";
import DietsAndIntolerances from "./DietsAndIntolerances";
import { estimateRecipeCost } from "../../utils/utils";
import { fetchUserIngredientsHelper } from "../../utils/databaseHelpers";
import type { GPErrorMessageTypes } from "../../utils/types";

type GPMealCardProps = {
  index: number;
  parsedMealData: GPRecipeDataTypes;
  selectedToCompare: boolean;
  cardSize: number;
  favorited: boolean;
  onMealCardClick: () => void;
  setMessage: (
    value: React.SetStateAction<GPErrorMessageTypes | undefined>
  ) => void;
  onSelectRecipe?: (data: GPRecipeDataTypes) => void;
  onEditRecipe?: (data: GPRecipeDataTypes) => void;
  onDeleteRecipe?: (data: GPRecipeDataTypes) => void;
  onLoadRecipeCost?: (data: GPRecipeDataTypes, index: number) => void;
  onCompareSelect?: (data: GPRecipeDataTypes) => void;
  onFavoriteClick?: (data: GPRecipeDataTypes) => void;
};

const MealCard: React.FC<GPMealCardProps> = ({
  index,
  parsedMealData,
  selectedToCompare,
  cardSize,
  favorited,
  onMealCardClick,
  setMessage,
  onSelectRecipe,
  onEditRecipe,
  onDeleteRecipe,
  onLoadRecipeCost,
  onCompareSelect,
  onFavoriteClick,
}) => {
  const [ingredientCostModalOpen, setIngredientCostModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const toggleModal = () => {
    setIngredientCostModalOpen((prev) => !prev);
  };

  const handleCostEstimateClick = async (
    event: React.MouseEvent<HTMLElement>
  ) => {
    event.stopPropagation();
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
    if (onLoadRecipeCost) {
      onLoadRecipeCost(updatedRecipeInfo, index);
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
        sx={{ minWidth: cardSize, width: cardSize }}
        onClick={() => onMealCardClick()}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
          }}
        >
          <Typography
            level="h4"
            sx={{
              textAlign: "center",
              textWrap: "nowrap",
              overflow: "hidden",
              whiteSpace: "nowrap",
              textOverflow: "ellipsis",
            }}
          >
            {parsedMealData.recipeTitle}
          </Typography>
          {onFavoriteClick && (
            <Tooltip
              title={favorited ? "Remove from favorites" : "Add to favorites"}
            >
              <IconButton
                color="primary"
                sx={{ zIndex: 2 }}
                onClick={(event) => {
                  event.stopPropagation();
                  onFavoriteClick(parsedMealData);
                }}
              >
                {favorited ? <FavoriteIcon /> : <FavoriteBorderIcon />}
              </IconButton>
            </Tooltip>
          )}
          {onCompareSelect && (
            <Tooltip title="Compare recipes">
              <Checkbox
                sx={{ zIndex: 5 }}
                size="lg"
                checked={selectedToCompare}
                onClick={(event) => {
                  event.stopPropagation();
                  onCompareSelect(parsedMealData);
                }}
              />
            </Tooltip>
          )}
        </Box>
        <Box sx={{ my: 0, display: "flex", justifyContent: "space-between" }}>
          <Typography>Servings: {parsedMealData.servings}</Typography>
          {onLoadRecipeCost && parsedMealData.totalCost > 0 && (
            <Typography>
              Estimated Cost: ${parsedMealData.totalCost.toFixed(2)}
            </Typography>
          )}
        </Box>
        <AspectRatio>
          <img src={parsedMealData.previewImage} />
        </AspectRatio>
        <CardContent sx={{ justifyContent: "flex-end" }}>
          {parsedMealData.editingAuthorName && (
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <PersonIcon />
              <Typography>
                Edited by: {parsedMealData.editingAuthorName}
              </Typography>
            </Box>
          )}
          {onSelectRecipe && (
            <DietsAndIntolerances recipeInfo={parsedMealData} />
          )}
          {onDeleteRecipe && (
            <IconButton
              color="primary"
              variant="plain"
              size="lg"
              onClick={(event) => {
                event.stopPropagation();
                onDeleteRecipe?.(parsedMealData);
              }}
              sx={{ zIndex: 1, alignSelf: "flex-end" }}
            >
              <DeleteIcon />
            </IconButton>
          )}
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            {onSelectRecipe && (
              <Tooltip title="Add to recipes to shop">
                <Button
                  onClick={(event) => {
                    event.stopPropagation();
                    setMessage({
                      error: false,
                      message: `Added ${parsedMealData.recipeTitle} to selected meals!`,
                    });
                    onSelectRecipe(parsedMealData);
                  }}
                >
                  Select Recipe
                </Button>
              </Tooltip>
            )}
            {onEditRecipe && (
              <Tooltip title="Add your own edits!">
                <IconButton
                  onClick={(event) => {
                    event.stopPropagation();
                    onEditRecipe(parsedMealData);
                  }}
                >
                  <EditIcon />
                </IconButton>
              </Tooltip>
            )}
            {onLoadRecipeCost && parsedMealData.totalCost > 0 && (
              <Button onClick={toggleModal}>See Pricing Details</Button>
            )}
            {onLoadRecipeCost && parsedMealData.totalCost <= 0 && (
              <Button loading={loading} onClick={handleCostEstimateClick}>
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
