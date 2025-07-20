import AppHeader from "../components/AppHeader"
import { Box } from "@mui/joy"
import { useState, useEffect } from "react"
import type { GPErrorMessageTypes, GPRecipeDataTypes } from "../utils/types"
import { fetchRecipes, handleUnfavoriteRecipe } from "../utils/databaseHelpers"
import TitledListView from "../components/TitledListView"
import MealCard from "../components/MealCard"
import { CenteredTitledListStyle } from "../utils/UIStyle"

const FavoritedRecipes = () => {
    const [favoritedRecipes, setFavoritedRecipes] = useState<GPRecipeDataTypes[]>([])
    const [message, setMessage] = useState<GPErrorMessageTypes>()
    useEffect(() => {
        fetchRecipes({setMessage, setRecipes: setFavoritedRecipes, recipeGroup: "favorited"})
    }, [])

    const onFavoriteClick = (meal: GPRecipeDataTypes) => {
        handleUnfavoriteRecipe({setMessage, recipe: meal})
        setFavoritedRecipes((prev) => prev.filter((recipe) => recipe.apiId !== meal.apiId))
    }

    return ( 
        <Box>
            <AppHeader />
            <Box sx={{my: 3}}>
            <TitledListView
                itemsList={favoritedRecipes}
                renderItem={(meal, index) => (
                    <MealCard
                    key={index}
                    index={index}
                    favorited={true}
                    onFavoriteClick={() => onFavoriteClick(meal)}
                    onMealCardClick={() => {}}
                    setMessage={setMessage}
                    parsedMealData={meal}
                    selectedToCompare={false}
                    cardSize={350}
                    />
                )}
                listItemsStyle={CenteredTitledListStyle}
                />
                </Box>
        </Box>
    )
}

export default FavoritedRecipes