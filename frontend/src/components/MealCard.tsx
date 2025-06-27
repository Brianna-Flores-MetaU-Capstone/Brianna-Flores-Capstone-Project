import "../styles/Meal.css"
import type { recipeType } from "../utils/types"

interface MealCardTypes {
    onMealCardClick: () => void
    parsedMealData: recipeType
}

// const MealCard = ({onMealCardClick}: {onMealCardClick: () => void}) => {
const MealCard = ({onMealCardClick, parsedMealData}: MealCardTypes) => {
    console.log(parsedMealData)
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
                {parsedMealData.vegetarian && <li>Gluten Free</li>}
                {parsedMealData.vegan && <li>Gluten Free</li>}
            </ul>
        </div>
    )
}

export default MealCard