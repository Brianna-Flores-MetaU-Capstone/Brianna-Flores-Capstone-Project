import "../styles/Meal.css";
import type { GPRecipeDataTypes } from "../utils/types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";

type GPMealCardProps = {
  onMealCardClick: () => void;
  parsedMealData: GPRecipeDataTypes;
  onSelectRecipe?: (data: GPRecipeDataTypes) => void;
  onDeleteRecipe?: (data: GPRecipeDataTypes) => void;
};

const MealCard: React.FC<GPMealCardProps> = ({
  onMealCardClick,
  parsedMealData,
  onSelectRecipe,
  onDeleteRecipe,
}) => {
  return (
    //click on card to view more able to see more information about recipe (ingredients needed, steps, etc)
    <div className="meal-card" onClick={() => onMealCardClick()}>
      <img className="meal-img" src={parsedMealData.previewImage} />
      <p className="meal-title">{parsedMealData.recipeTitle}</p>
      <p>Servings: {parsedMealData.servings}</p>
      <p>Estimated Price: ${parsedMealData.totalCost}</p>
      <ul className="diets-and-intolerances">
        {parsedMealData.dairyFree && <li>Dairy Free</li>}
        {parsedMealData.glutenFree && <li>Gluten Free</li>}
        {parsedMealData.vegetarian && <li>Vegetarian</li>}
        {parsedMealData.vegan && <li>Vegan</li>}
      </ul>
      {onDeleteRecipe && (
        <FontAwesomeIcon
          icon={faTrash}
          className="ingredient-button"
          onClick={(event) => {
            event.stopPropagation();
            onDeleteRecipe?.(parsedMealData);
          }}
        />
      )}
      {onSelectRecipe && (
        <button onClick={() => onSelectRecipe(parsedMealData)}>
          Select Recipe
        </button>
      )}
    </div>
  );
};

export default MealCard;
