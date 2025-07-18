import type {
  GPErrorMessageTypes,
  GPIngredientDataTypes,
  GPRecipeDataTypes,
} from "../utils/types";
import AppHeader from "../components/AppHeader";
import TitledListView from "../components/TitledListView";
import { PreviewConstants } from "../utils/constants";
import { MUI_GRID_FULL_SPACE } from "../utils/UIStyle";
import Ingredient from "../components/Ingredient";
import MealCard from "../components/MealCard";
import {
  fetchGroceryList,
  fetchUserIngredientsHelper,
  fetchRecipes,
} from "../utils/databaseHelpers";
import { useState, useEffect } from "react";
import { useUser } from "../contexts/UserContext";
import { Box, Grid } from "@mui/joy";
import { useNavigate } from "react-router";

const LIST_HEIGHT = 250

const Homepage = () => {
  const [message, setMessage] = useState<GPErrorMessageTypes>();
  const [userGroceryList, setUserGroceryList] = useState<
    GPIngredientDataTypes[]
  >([]);
  const [userIngredientList, setUserIngredientList] = useState<
    GPIngredientDataTypes[]
  >([]);
  const [selectedRecipes, setSelectedRecipes] = useState<GPRecipeDataTypes[]>(
    []
  );

  const { user } = useUser();
  const navigate = useNavigate()

  useEffect(() => {
    const setUserListPreviews = async () => {
        fetchGroceryList({ setMessage, setUserGroceryList });
        const userIngredients = await fetchUserIngredientsHelper({
          setMessage,
        });
        setUserIngredientList(userIngredients);
        await fetchRecipes({ setMessage, setSelectedRecipes });
    };
    setUserListPreviews();
  }, []);

  return (
    <Box>
      <AppHeader />
      <Box sx={{ m: 2 }}>
        <Grid container spacing={2} sx={{my: 2}}>
          <Grid xs={6}>
            <TitledListView
              headerList={[{ title: PreviewConstants.INGREDIENT, spacing: MUI_GRID_FULL_SPACE }]}
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
              listHeight={LIST_HEIGHT}
            />
          </Grid>
          <Grid xs={6}>
            <TitledListView
              headerList={[{ title: PreviewConstants.GROCERY, spacing: MUI_GRID_FULL_SPACE }]}
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
              listHeight={LIST_HEIGHT}
            />
          </Grid>
        </Grid>
        <Box>
          <TitledListView
            headerList={[{ title: "Selected Meals", spacing: MUI_GRID_FULL_SPACE }]}
            itemsList={selectedRecipes}
            renderItem={(meal, index) => (
              <MealCard
                key={meal.apiId}
                index={index}
                onMealCardClick={() => navigate("/new-list")}
                parsedMealData={meal}
                setMessage={setMessage}
                selected={false}
              />
            )}
            flexDirectionRow={true}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default Homepage;
