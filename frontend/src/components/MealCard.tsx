import "../styles/Meal.css";
import type { GPRecipeDataTypes } from "../utils/types";

type GPMealCardProps = {
  onMealCardClick: () => void;
  parsedMealData: GPRecipeDataTypes;
  onSelectRecipe?: (data: GPRecipeDataTypes) => void;
};

const MealCard: React.FC<GPMealCardProps> = ({
  onMealCardClick,
  parsedMealData,
  onSelectRecipe,
}) => {
  return (
    //click on card to view more able to see more information about recipe (ingredients needed, steps, etc)
    <div className="meal-card" onClick={() => onMealCardClick()}>
      <img className="meal-img" src={parsedMealData.image} />
      <p className="meal-title">{parsedMealData.title}</p>
      <p>Servings: {parsedMealData.servings}</p>
      <p>Estimated Price: ${parsedMealData.totalEstimatedCost}</p>
      <ul className="diets-and-intolerances">
        {parsedMealData.dairyFree && <li>Dairy Free</li>}
        {parsedMealData.glutenFree && <li>Gluten Free</li>}
        {parsedMealData.vegetarian && <li>Vegetarian</li>}
        {parsedMealData.vegan && <li>Vegan</li>}
      </ul>
      {onSelectRecipe && (
        <button onClick={() => onSelectRecipe(parsedMealData)}>
          Select Recipe
        </button>
      )}
    </div>
  );
};

export default MealCard;
