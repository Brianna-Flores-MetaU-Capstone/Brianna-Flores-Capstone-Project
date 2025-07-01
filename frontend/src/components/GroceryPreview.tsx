import React from "react";
import Ingredient from "./Ingredient";
import type { IngredientData } from "../utils/types";
import "../styles/Homepage.css"
import { v4 as uuidv4 } from "uuid";

const GroceryPreview = ({groceryList}: {groceryList: IngredientData[]}) => {
    return (
        <div className="grocery-preview">
            <h3>Grocery List</h3>
            <div className="list-items">
            {
                groceryList.map((item) => {
                    return (
                        <Ingredient key={uuidv4()} ingredient={item} groceryCheck={true} presentExpiration={false} presentButtons={false}/>
                    )
                })
            }
            </div>
        </div>
    )
}

export default GroceryPreview