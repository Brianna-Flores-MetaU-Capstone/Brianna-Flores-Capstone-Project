import React from "react";
import "../styles/Meal.css";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import { GPModalStyle } from "../utils/utils";

type GPMealModalProps = {
  modalOpen: boolean;
  handleModalClose: () => void;
};

const MealInfoModal: React.FC<GPMealModalProps> = ({
  handleModalClose,
  modalOpen,
}) => {
  return (
    //click on card to view more able to see more information about recipe (ingredients needed, steps, etc)
    <Modal open={modalOpen} onClose={handleModalClose}>
      <Box sx={GPModalStyle}>
        <div className="modal-header">
          <img
            className="meal-img"
            src="https://images.pexels.com/photos/3969253/pexels-photo-3969253.jpeg"
          />
          <div className="meal-info">
            <h2>Meal Title</h2>
            <p>Servings: X</p>
            <p>Estimated Cost: $X.XX</p>
            {/* List out intolerances/diets this recipe qualifies for */}
            <ul className="diets-and-intolerances">
              <li>Dairy Free</li>
              <li>Vegetarian</li>
            </ul>
          </div>
        </div>
        <h4>Missing Ingredients</h4>
        <ul>
          <li>Ingredient 1</li>
          <li>3 Chicken Breasts</li>
        </ul>
        <h4>Ingredients on Hand</h4>
        <ul>
          {/* say recipe will use 5 chicken breasts and 2 on hand, still need 3 more  */}
          <li>Ingredient 1</li>
          <li>2 Chicken Breasts</li>
        </ul>
      </Box>
    </Modal>
  );
};

export default MealInfoModal;
