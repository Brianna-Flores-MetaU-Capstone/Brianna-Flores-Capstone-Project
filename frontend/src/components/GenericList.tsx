import React from "react";
import Ingredient from "./Ingredient";
import type { GPIngredientDataTypes } from "../utils/types";
import "../styles/Homepage.css";
import { v4 as uuidv4 } from "uuid";

interface GPHomepagePreviewProps<T> {
  titles: string[]
  list: GPIngredientDataTypes[];
  listConfig: (item: GPIngredientDataTypes) => {
    groceryCheck: boolean;
    presentExpiration: boolean,
    presentButtons: boolean
    onEdit?: (ingredient: GPIngredientDataTypes) => void;
  }
}

const GenericList = <T,>({titles, list, listConfig}: GPHomepagePreviewProps<T>) => {
  return (
    <div className="item-list">
      <div className="ingredient-columns">
      {
        titles.map((title) => 
          <h3 key={uuidv4()}>{title}</h3>
        )
      }
      </div>
      <div className="list-items">
        {list.map((item) => {
          return (
            <Ingredient
              key={uuidv4()}
              ingredient={item}
              {...listConfig(item)}
            />
          );
        })}
      </div>
    </div>
  );
};

export default GenericList;
