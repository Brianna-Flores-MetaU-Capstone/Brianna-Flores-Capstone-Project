import React from "react";
import Ingredient from "./Ingredient";
import type { ingredientType } from "../utils/types";
import "../styles/Homepage.css"
import { v4 as uuidv4 } from "uuid";

const GroceryPreview = ({groceryList}: {groceryList: ingredientType[]}) => {
    return (
        <div className="grocery-preview">
            <header>Grocery List</header>
            {
                groceryList.map((item) => {
                    return (
                        <Ingredient key={uuidv4()} ingredient={item} />
                    )
                })
            }
        </div>
    )
}

export default GroceryPreview