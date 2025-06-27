import "../styles/Meal.css"
import { useState } from 'react'

const AddAnotherMealModal = ({handleModalClose}: {handleModalClose: () => void}) => {
    const [mealRequest, setMealRequest] = useState({ recipe: "", servings: ""})

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setMealRequest((prev) => ({ ...prev, [name]: value }));
    };
    return (
        <section className='modal' id="meal-modal">
            <div className='modal-content mealModal'>
                <button className='modal-close' onClick={handleModalClose}>&times;</button>
                <form className="meal-form">
                    <label htmlFor="recipe">Recipe</label>
                    <input type="text" name="recipe" value={mealRequest.recipe} onChange={handleChange} required/>
                    <label htmlFor="servings">Servings</label>
                    <input type="text" name="servings" value={mealRequest.servings} onChange={handleChange} required/>
                    <button>Find Some Recipes!</button>
                </form>
                <button>Need Some Inspiration?</button>
                <button>I Have My Own Recipe</button>
            </div>
        </section>
    )
}

export default AddAnotherMealModal