import React from "react";
import { GPModalStyle } from "../utils/UIStyle";
import type { GPRecipeDataTypes } from "../utils/types";
import {
  Modal,
  Typography,
  Sheet,
  List,
  ListItem,
  ListItemContent,
  Box,
  Link,
  AspectRatio,
} from "@mui/joy";
import LinkIcon from '@mui/icons-material/Link';
import DietsAndIntolerances from "./DietsAndIntolerances";
import { GPCenteredBoxStyle } from "../utils/UIStyle";

type GPMealModalProps = {
  modalOpen: boolean;
  handleModalClose: () => void;
  recipeInfo: GPRecipeDataTypes | undefined;
};

const MealInfoModal: React.FC<GPMealModalProps> = ({
  handleModalClose,
  modalOpen,
  recipeInfo,
}) => {
  return (
    // click on card to view more able to see more information about recipe (ingredients needed, steps, etc)
    <Modal
      open={modalOpen}
      onClose={handleModalClose}
      sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}
    >
      <Sheet variant="outlined" sx={GPModalStyle}>
        <Box sx={{ display: "flex" }}>
          <AspectRatio ratio="1" sx={{ width: "50%", borderRadius: "md"}}>
            <img src={recipeInfo?.previewImage} />
          </AspectRatio>
          <Box
            sx={GPCenteredBoxStyle}
          >
            <Typography level="h2">{recipeInfo?.recipeTitle}</Typography>
            <Typography>Servings: {recipeInfo?.servings}</Typography>
            <DietsAndIntolerances recipeInfo={recipeInfo} />
            <Link href={recipeInfo?.sourceUrl} startDecorator={<LinkIcon/>}>Recipe link</Link>
          </Box>
        </Box>
        <Box>
          <Typography level="h3">Ingredients</Typography>
          <List marker="circle">
            {(recipeInfo?.ingredients ?? []).map((ingredient, index) => {
              return (
                <ListItem
                  key={index}
                >
                  <ListItemContent
                    sx={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <Typography>{ingredient.ingredientName}</Typography>
                    <Typography>
                      {ingredient.quantity % 1 === 0
                        ? ingredient.quantity
                        : ingredient.quantity.toFixed(2)}{" "}
                      {ingredient.unit}
                    </Typography>
                  </ListItemContent>
                </ListItem>
              );
            })}
          </List>
          <Typography level="h3">Instructions</Typography>
          <List component="ol" marker="decimal">
            {recipeInfo?.instructions.map((step, index) => {
              return <ListItem key={index}>{step}</ListItem>;
            })}
          </List>
        </Box>
      </Sheet>
    </Modal>
  );
};

export default MealInfoModal;
