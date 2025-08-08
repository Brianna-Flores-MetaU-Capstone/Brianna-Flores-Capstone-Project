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
  Link,
  Grid,
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
import type { GPErrorMessageTypes } from "../../utils/types/types";
import { Recipe } from "../../../../shared/Recipe";
import ConnectCalendar from "../calendar/ConnectCalendar";
import LinkIcon from "@mui/icons-material/Link";
import { ALERT_TIMEOUT } from "../../utils/constants";
import { useUser } from "../../contexts/UserContext";

type GPMealCardProps = {
  index: number;
  parsedMealData: Recipe;
  selectedToCompare: boolean;
  favorited: boolean;
  toggleCalendarTimeModal?: () => void;
  onMealCardClick?: () => void;
  setMessage: (
    value: React.SetStateAction<GPErrorMessageTypes | undefined>,
  ) => void;
  onSelectRecipe?: (data: Recipe) => void;
  onEditRecipe?: (data: Recipe) => void;
  onDeleteRecipe?: (data: Recipe) => void;
  onLoadRecipeCost?: (data: Recipe, index: number) => void;
  onCompareSelect?: (data: Recipe) => void;
  onFavoriteClick?: (data: Recipe) => void;
};

const MealCard: React.FC<GPMealCardProps> = ({
  index,
  parsedMealData,
  selectedToCompare,
  favorited,
  toggleCalendarTimeModal,
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
  const [currentLikes, setCurrentLikes] = useState(parsedMealData.likes);
  const { user } = useUser();

  const toggleModal = () => {
    setIngredientCostModalOpen((prev) => !prev);
  };

  const handleCostEstimateClick = async (
    event: React.MouseEvent<HTMLElement>,
  ) => {
    event.stopPropagation();
    setLoading(true);
    const ownedIngredients =
      (await fetchUserIngredientsHelper({
        setMessage: setMessage,
      })) ?? [];
    const estimatedRecipeCostInfo = await estimateRecipeCost({
      ownedIngredients,
      recipeIngredients: parsedMealData.ingredients,
    });
    parsedMealData.ingredientCostInfo =
      estimatedRecipeCostInfo?.ingredientCostInfo ?? [];
    parsedMealData.totalCost = estimatedRecipeCostInfo?.estimatedCost ?? 0;
    if (onLoadRecipeCost) {
      onLoadRecipeCost(parsedMealData, index);
    }
    setLoading(false);
    toggleModal();
  };

  return (
    // click on card to view more able to see more information about recipe (ingredients needed, steps, etc)
    <>
      {/* Code referenced from MUI Joy Documentation https://mui.com/joy-ui/react-card/#interactive-card*/}
      <Card variant="outlined">
        <Grid container sx={{ mr: 2 }}>
          <Grid xs={10}>
            <Typography level="h4">{parsedMealData.recipeTitle}</Typography>
          </Grid>
          <Grid xs={2}>
            <Box
              sx={{
                display: "flex",
                gap: 1,
                alignItems: "center",
                justifyContent: "flex-end",
              }}
            >
              {onFavoriteClick && (
                <Tooltip
                  title={
                    favorited ? "Remove from favorites" : "Add to favorites"
                  }
                >
                  <IconButton
                    color="primary"
                    sx={{ zIndex: 2 }}
                    disabled={user ? false : true}
                    onClick={(event) => {
                      event.stopPropagation();
                      if (onFavoriteClick) {
                        setCurrentLikes((prev) =>
                          favorited ? prev - 1 : prev + 1,
                        );
                        onFavoriteClick(parsedMealData);
                      }
                    }}
                  >
                    {favorited ? <FavoriteIcon /> : <FavoriteBorderIcon />}
                    <Typography>{currentLikes}</Typography>
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
          </Grid>
        </Grid>
        <Box sx={{ my: 0, display: "flex", justifyContent: "space-between" }}>
          <Typography>Servings: {parsedMealData.servings}</Typography>
          <Typography>
            Cook Time: {parsedMealData.readyInMinutes} minutes
          </Typography>
        </Box>
        <AspectRatio>
          <img src={parsedMealData.previewImage[0]} />
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
          {onLoadRecipeCost && parsedMealData.totalCost > 0 && (
            <Typography alignSelf="flex-end">
              Estimated Cost: ${parsedMealData.totalCost.toFixed(2)}
            </Typography>
          )}
          {onMealCardClick && (
            <DietsAndIntolerances recipeInfo={parsedMealData} />
          )}
          {toggleCalendarTimeModal && (
            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              {parsedMealData.calendarEvents.length > 0 ? (
                <Box>
                  <Link
                    endDecorator={<LinkIcon />}
                    href={parsedMealData.calendarEvents[0].eventLink}
                    level="h4"
                  >
                    Scheduled For
                  </Link>
                  <Typography>
                    {parsedMealData.calendarEvents[0].getFormattedDate()}
                  </Typography>
                  <Typography>
                    {parsedMealData.calendarEvents[0].getFormattedTime()}
                  </Typography>
                </Box>
              ) : (
                <ConnectCalendar
                  onClick={toggleCalendarTimeModal}
                  singleRecipe={true}
                  recipeInfo={parsedMealData}
                />
              )}
              {onDeleteRecipe && (
                <Tooltip title="Remove recipe">
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
                </Tooltip>
              )}
            </Box>
          )}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              gap: 1,
            }}
          >
            {onSelectRecipe && (
              <Tooltip title="Add to recipes to shop">
                <Button
                  onClick={(event) => {
                    event.stopPropagation();
                    setMessage({
                      error: false,
                      message: `Added ${parsedMealData.recipeTitle} to selected meals!`,
                    });
                    setTimeout(() => {
                      setMessage(undefined);
                    }, ALERT_TIMEOUT);
                    onSelectRecipe(parsedMealData);
                  }}
                >
                  Select Recipe
                </Button>
              </Tooltip>
            )}
            {onMealCardClick && (
              <Button sx={{ flexGrow: 1 }} onClick={() => onMealCardClick()}>
                View Recipe Details
              </Button>
            )}
            {onEditRecipe && (
              <Tooltip title="Create your own variant!">
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
          totalCost={parsedMealData.totalCost}
          modalOpen={ingredientCostModalOpen}
          onClose={toggleModal}
        />
      )}
    </>
  );
};

export default MealCard;
