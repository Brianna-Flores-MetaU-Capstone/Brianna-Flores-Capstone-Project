import AppHeader from "../components/AppHeader";
import { Box } from "@mui/joy";
import { useState, useEffect } from "react";
import type { GPErrorMessageTypes, GPRecipeDataTypes } from "../utils/types";
import { fetchDiscoverRecipes } from "../utils/databaseHelpers";
import TitledListView from "../components/TitledListView";
import MealCard from "../components/MealCard";
import { MUI_GRID_FULL_SPACE, RowOverflowTitledListStyle } from "../utils/UIStyle";
const NUM_TO_FETCH = 10;

// https://www.typescriptlang.org/docs/handbook/utility-types.html#recordkeys-type
type GPRecipeDiscoveryCategories = "all" | "dairyFree" | "glutenFree" | "vegetarian" | "vegan"

interface GPRecipeDiscoveryCategory {
    recipeList: GPRecipeDataTypes[]
}


const RecipeDiscoveryPage = () => {
  // fetch recipes from the database
  const [discoverRecipes, setDiscoverRecipes] = useState<GPRecipeDataTypes[]>(
    []
  );
  const [recipeDiscoveryCategoryResults, setRecipeDiscoveryCategoryResults] = useState<Record<GPRecipeDiscoveryCategories, GPRecipeDiscoveryCategory>>({
    all: {recipeList: []},
    dairyFree: {recipeList: []},
    glutenFree: {recipeList: []},
    vegetarian: {recipeList: []},
    vegan: {recipeList: []},
  })
  const [message, setMessage] = useState<GPErrorMessageTypes>();
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    fetchDiscoverRecipes({
      setMessage,
      offset,
      numRequested: NUM_TO_FETCH,
      setDiscoverRecipes,
    });
  }, []);

  return (
    <Box>
      <AppHeader />
      <Box sx={{ m: 2 }}>
        <TitledListView
          itemsList={discoverRecipes}
          headerList={[{title: "Discover Recipes", spacing: MUI_GRID_FULL_SPACE}]}
          renderItem={(meal, index) => (
            <MealCard
              key={meal.apiId}
              index={index}
              onMealCardClick={() => {}}
              setMessage={setMessage}
              parsedMealData={meal}
              selected={false}
              cardSize={200}
              />
            )}
            listItemsStyle={RowOverflowTitledListStyle}
        />
      </Box>
    </Box>
  );
};

export default RecipeDiscoveryPage;
