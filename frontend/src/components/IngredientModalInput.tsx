// import React from 'react'
// import type { RecipeIngredientData } from '../utils/types'

// const IngredientModalInput = ({ ingredientData, title, value, handleInputChange }: {ingredientData?: RecipeIngredientData, title: string, value: string, handleInputChange: (event: React.ChangeEvent<HTMLInputElement>) => void }) => {
//     console.log(value)
//     type ingredientKey = keyof RecipeIngredientData;
//     const key: ingredientKey = value;
    
//     return (
//         <div className="ingredient-input">
//             <label htmlFor={`ingredient-${value}`}>{title}</label>
//             <input name={value} id={`ingredient-${value}`} value={ingredientData && key in ingredientData ? ingredientData[key] : ""} onChange={handleInputChange}/>
//         </div>
//     )
// }

// export default IngredientModalInput