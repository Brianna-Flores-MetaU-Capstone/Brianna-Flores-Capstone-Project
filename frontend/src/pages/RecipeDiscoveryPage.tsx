import AppHeader from "../components/AppHeader";
import { Box, Button } from "@mui/joy";
import { useState, useEffect } from "react";
import type { GPErrorMessageTypes, GPRecipeDataTypes } from "../utils/types";
import { fetchDiscoverRecipes } from "../utils/databaseHelpers";
import TitledListView from "../components/TitledListView";
import MealCard from "../components/MealCard";
const NUM_TO_FETCH = 10;

const RecipeDiscoveryPage = () => {
    // fetch recipes from the database
    const [discoverRecipes, setDiscoverRecipes] = useState<GPRecipeDataTypes[]>([])
    const [message, setMessage] = useState<GPErrorMessageTypes>()
    const [offset, setOffset] = useState(0)

    useEffect(() => {
        fetchDiscoverRecipes({setMessage, offset, numRequested: NUM_TO_FETCH, setDiscoverRecipes})
    }, [])

    return (
        <Box>
            <AppHeader />
            <Button onClick={() => console.log(discoverRecipes)}>Check discover recipes</Button>
            <TitledListView
                itemsList={discoverRecipes}
                renderItem={(meal, index) => (
                    <MealCard
                key={meal.apiId}
                index={index}
                onMealCardClick={() => {}}
                setMessage={setMessage}
                parsedMealData={meal}
                selected={false}
              />
                )}
                />
        </Box>
    )
}

export default RecipeDiscoveryPage