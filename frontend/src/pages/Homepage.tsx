import "../styles/Homepage.css";
import type {
  GPErrorMessageTypes,
  GPIngredientDataTypes,
  GPIngredientWithCostInfoTypes,
  GPRecipeDataTypes,
} from "../utils/types";
import AppHeader from "../components/AppHeader";
import TitledListView from "../components/TitledListView";
import { PreviewConstants } from "../utils/constants";
import Ingredient from "../components/Ingredient";
import MealCard from "../components/MealCard";
import { v4 as uuidv4 } from "uuid";
import {
  fetchGroceryList,
  fetchUserIngredientsHelper,
  fetchRecipes,
} from "../utils/databaseHelpers";
import { useState, useEffect } from "react";
import { useUser } from "../contexts/UserContext";
import { Box, Grid } from "@mui/joy";

const Homepage = () => {
  const [message, setMessage] = useState<GPErrorMessageTypes>();
  const [userGroceryList, setUserGroceryList] = useState<
    GPIngredientWithCostInfoTypes[]
  >([]);
  const [userIngredientList, setUserIngredientList] = useState<
    GPIngredientDataTypes[]
  >([]);
  const [selectedRecipes, setSelectedRecipes] = useState<GPRecipeDataTypes[]>(
    []
  );

  const { user } = useUser();

  useEffect(() => {
    const setUserListPreviews = async () => {
      if (user) {
        fetchGroceryList({ setMessage, setUserGroceryList });
        const userIngredients = await fetchUserIngredientsHelper({
          setMessage,
        });
        setUserIngredientList(userIngredients);
        await fetchRecipes({ setMessage, setSelectedRecipes });
      }
    };
    setUserListPreviews();
  }, []);
  return (
    <Box>
      <AppHeader />
      <Box sx={{ m: 2 }}>
        <Grid container spacing={2}>
          <Grid xs={6} sx={{ border: "2px solid"}}>
            <TitledListView
              headerList={[{ title: PreviewConstants.INGREDIENT, spacing: 12 }]}
              list={userIngredientList}
              renderItem={(ingredient) => (
                <Ingredient
                  key={uuidv4()}
                  ingredient={ingredient}
                  presentGroceryCheck={false}
                  presentExpiration={false}
                  presentButtons={false}
                />
              )}
              listHeight={300}
            />
          </Grid>
          <Grid xs={6}>
            <TitledListView
              headerList={[{ title: PreviewConstants.GROCERY, spacing: 12 }]}
              list={userGroceryList}
              renderItem={(item) => (
                <Ingredient
                  key={uuidv4()}
                  ingredient={item?.ingredient}
                  presentGroceryCheck={true}
                  presentExpiration={false}
                  presentButtons={false}
                />
              )}
              listHeight={300}
            />
          </Grid>
        </Grid>
        <Box className="upcoming-meals">
          <TitledListView
            headerList={[{ title: "Upcoming Meals", spacing: 1 }]}
            list={selectedRecipes}
            renderItem={(meal) => (
              <MealCard
                key={meal.apiId}
                onMealCardClick={() => event?.preventDefault()}
                parsedMealData={meal}
              />
            )}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default Homepage;
