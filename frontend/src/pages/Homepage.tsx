import type {
  GPErrorMessageTypes,
  GPIngredientDataTypes,
} from "../utils/types/types";
import AppHeader from "../components/utils/AppHeader";
import TitledListView from "../components/utils/TitledListView";
import { PreviewConstants, RecipeFetchEnum } from "../utils/constants";
import { MUI_GRID_FULL_SPACE } from "../utils/style/UIStyle";
import Ingredient from "../components/ingredients/Ingredient";
import MealCard from "../components/recipeDisplay/MealCard";
import {
  fetchGroceryList,
  fetchUserIngredientsHelper,
  fetchRecipes,
} from "../utils/databaseHelpers";
import { useState, useEffect } from "react";
import { useUser } from "../contexts/UserContext";
import { Box, Grid } from "@mui/joy";
import { useNavigate } from "react-router";
import {
  ColumnOverflowTitledListStyle,
  RowOverflowTitledListStyle,
} from "../utils/style/UIStyle";
import { Recipe } from "../../../shared/Recipe";

const Homepage = () => {
  const [message, setMessage] = useState<GPErrorMessageTypes>();
  const [userGroceryList, setUserGroceryList] = useState<
    GPIngredientDataTypes[]
  >([]);
  const [userIngredientList, setUserIngredientList] = useState<
    GPIngredientDataTypes[]
  >([]);
  const [selectedRecipes, setSelectedRecipes] = useState<Recipe[]>([]);

  const { user } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    const setUserListPreviews = async () => {
      fetchGroceryList({ setMessage, setUserGroceryList });
      const userIngredients = await fetchUserIngredientsHelper({
        setMessage,
      });
      setUserIngredientList(userIngredients);
      await fetchRecipes({
        setMessage,
        setRecipes: setSelectedRecipes,
        recipeGroup: RecipeFetchEnum.PLANNED,
      });
    };
    setUserListPreviews();
  }, []);

  return (
    <Box>
      <AppHeader />
      <Box sx={{ m: 2 }}>
        <Grid container spacing={2} sx={{ my: 2 }}>
          <Grid xs={6}>
            <TitledListView
              headerList={[
                {
                  title: PreviewConstants.INGREDIENT,
                  spacing: MUI_GRID_FULL_SPACE,
                },
              ]}
              itemsList={userIngredientList}
              renderItem={(ingredient, index) => (
                <Ingredient
                  key={index}
                  ingredient={ingredient}
                  presentGroceryCheck={false}
                  presentExpiration={false}
                  presentButtons={false}
                />
              )}
              listItemsStyle={ColumnOverflowTitledListStyle}
            />
          </Grid>
          <Grid xs={6}>
            <TitledListView
              headerList={[
                {
                  title: PreviewConstants.GROCERY,
                  spacing: MUI_GRID_FULL_SPACE,
                },
              ]}
              itemsList={userGroceryList}
              renderItem={(item, index) => (
                <Ingredient
                  key={index}
                  ingredient={item}
                  presentGroceryCheck={true}
                  presentExpiration={false}
                  presentButtons={false}
                />
              )}
              listItemsStyle={ColumnOverflowTitledListStyle}
            />
          </Grid>
        </Grid>
        <Box>
          <TitledListView
            headerList={[
              { title: "Selected Meals", spacing: MUI_GRID_FULL_SPACE },
            ]}
            itemsList={selectedRecipes}
            renderItem={(meal, index) => (
              <MealCard
                key={index}
                index={index}
                favorited={false}
                onMealCardClick={() => navigate("/new-list")}
                parsedMealData={meal}
                setMessage={setMessage}
                selectedToCompare={false}
              />
            )}
            listItemsStyle={RowOverflowTitledListStyle}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default Homepage;
