import "../styles/Meal.css"

const MealCard = () => {
    // const handleMealCardClick = (event: React.MouseEvent<HTMLElement>) => {
    const handleMealCardClick = () => {
        // open meal card modal
    }

    return (
        //click on card to view more able to see more information about recipe (ingredients needed, steps, etc)
        <div className="meal-card" onClick={handleMealCardClick}>
            <img className="meal-img" src="https://images.pexels.com/photos/3969253/pexels-photo-3969253.jpeg"/>
            <p className="meal-title">Meal Title</p>
            <p>Servings: X</p>
            <p>Estimated Price: $X.XX</p>
        </div>
    )
}

export default MealCard