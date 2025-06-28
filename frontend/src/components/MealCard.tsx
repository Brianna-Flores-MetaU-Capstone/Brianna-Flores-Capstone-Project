import "../styles/Meal.css"
import type { recipeType } from "../utils/types"

interface MealCardTypes {
    onMealCardClick: () => void
    parsedMealData: recipeType
    onSelectRecipe?: (data: recipeType) => void
}

// const MealCard = ({onMealCardClick}: {onMealCardClick: () => void}) => {
const MealCard = ({onMealCardClick, parsedMealData, onSelectRecipe}: MealCardTypes) => {
    return (
        //click on card to view more able to see more information about recipe (ingredients needed, steps, etc)
        <div className="meal-card" onClick={() => onMealCardClick()}>
            <img className="meal-img" src={parsedMealData.image}/>
            <p className="meal-title">{parsedMealData.title}</p>
            <p>Servings: {parsedMealData.servings}</p>
            <p>Estimated Price: ${parsedMealData.totalEstimatedCost}</p>
            <ul className="diets-and-intollerances">
                {parsedMealData.dairyFree && <li>Dairy Free</li>}
                {parsedMealData.glutenFree && <li>Gluten Free</li>}
                {parsedMealData.vegetarian && <li>Vegetarian</li>}
                {parsedMealData.vegan && <li>Vegan</li>}
            </ul>
            {onSelectRecipe && <button onClick={() => onSelectRecipe(parsedMealData)}>Select Recipe</button>}
        </div>
    )
}

export default MealCard