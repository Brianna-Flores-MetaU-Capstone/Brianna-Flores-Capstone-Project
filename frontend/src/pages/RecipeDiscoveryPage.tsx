import AppHeader from "../components/AppHeader";
import { Box } from "@mui/joy";
import { useState, useEffect } from "react";
import type {
  GPErrorMessageTypes,
  GPRecipeDiscoveryCategories,
  GPRecipeDataTypes,
} from "../utils/types";
import { fetchAllRecipeCategories } from "../utils/databaseHelpers";
import TitledListView from "../components/TitledListView";
import MealCard from "../components/MealCard";
import {
  MUI_GRID_FULL_SPACE,
  RowOverflowTitledListStyle,
} from "../utils/UIStyle";
import ErrorState from "../components/ErrorState";
import MealInfoModal from "../components/MealInfoModal";

// https://www.typescriptlang.org/docs/handbook/utility-types.html#recordkeys-type
const recipeFilters = [
  { filter: "all", title: "Discover All Recipes" },
  { filter: "dairyFree", title: "Dairy Free Recipes" },
  { filter: "glutenFree", title: "Gluten Free Recipes" },
  { filter: "vegetarian", title: "Vegetarian Recipes" },
  { filter: "vegan", title: "Vegan Recipes" },
];

const RecipeDiscoveryPage = () => {
  // fetch recipes from the database
  const [recipeDiscoveryResults, setRecipeDiscoveryResults] =
    useState<GPRecipeDiscoveryCategories>({
      all: [],
      dairyFree: [],
      glutenFree: [],
      vegetarian: [],
      vegan: [],
    });
  const [message, setMessage] = useState<GPErrorMessageTypes>();
  const [recipeInfoModalOpen, setRecipeInfoModalOpen] = useState(false);
  const [recipeInfoModalInfo, setRecipeInfoModalInfo] =
    useState<GPRecipeDataTypes>();

  useEffect(() => {
    fetchAllRecipeCategories({
      setMessage,
      setRecipeDiscoveryResults,
      filters: recipeFilters,
      offset: 0,
    });
  }, []);

  const handleRecipeCardClick = (recipe: GPRecipeDataTypes) => {
    setRecipeInfoModalOpen((prev) => !prev);
    setRecipeInfoModalInfo(recipe);
  };

  return (
    <Box>
      <AppHeader />
      <Box sx={{ m: 2 }}>
        {Object.keys(recipeDiscoveryResults).map((filter, i) => (
          <TitledListView
            itemsList={
              recipeDiscoveryResults[
                filter as keyof GPRecipeDiscoveryCategories
              ]
            }
            headerList={[
              { title: recipeFilters[i].title, spacing: MUI_GRID_FULL_SPACE },
            ]}
            renderItem={(meal, index) => (
              <MealCard
                key={meal.apiId}
                index={index}
                onMealCardClick={() => handleRecipeCardClick(meal)}
                setMessage={setMessage}
                parsedMealData={meal}
                selected={false}
                cardSize={200}
              />
            )}
            listItemsStyle={RowOverflowTitledListStyle}
          />
        ))}
      </Box>
      {message && (
        <ErrorState error={message.error} message={message.message} />
      )}
      <MealInfoModal
        toggleModal={() => setRecipeInfoModalOpen((prev) => !prev)}
        modalOpen={recipeInfoModalOpen}
        recipeInfo={recipeInfoModalInfo}
      />
    </Box>
  );
};

export default RecipeDiscoveryPage;
