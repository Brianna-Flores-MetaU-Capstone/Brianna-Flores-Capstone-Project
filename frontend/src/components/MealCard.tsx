import "../styles/Meal.css"

const MealCard = ({onMealCardClick}: {onMealCardClick: () => void}) => {
    return (
        //click on card to view more able to see more information about recipe (ingredients needed, steps, etc)
        <div className="meal-card" onClick={() => onMealCardClick()}>
            <img className="meal-img" src="https://images.pexels.com/photos/3969253/pexels-photo-3969253.jpeg"/>
            <p className="meal-title">Meal Title</p>
            <p>Servings: X</p>
            <p>Estimated Price: $X.XX</p>
            <ul className="diets-and-intollerances">
                <li>Dairy Free</li>
                <li>Vegetarian</li>
            </ul>
        </div>
    )
}

export default MealCard