import { Box, Grid, Typography, List, ListItem } from "@mui/joy";
import { GPDiffHeaderStyle } from "../../utils/style/UIStyle";
import type { Recipe } from "../../../../shared/Recipe";

type GPInstructionsDiffTypes = {
  recipeA: Recipe | undefined;
  recipeB: Recipe | undefined;
};

const RecipeDiffInstructionsBlock = ({
  recipeA,
  recipeB,
}: GPInstructionsDiffTypes) => {
  return (
    <Box>
      <Typography sx={GPDiffHeaderStyle} level="h2">
        Compare Instructions
      </Typography>
      <Grid container spacing={2}>
        <Grid xs={6}>
          <List component="ol" marker="decimal">
            {recipeA?.instructions.map((step, index) => {
              return <ListItem key={index}>{step}</ListItem>;
            })}
          </List>
        </Grid>
        <Grid xs={6}>
          <List component="ol" marker="decimal">
            {recipeB?.instructions.map((step, index) => {
              return <ListItem key={index}>{step}</ListItem>;
            })}
          </List>
        </Grid>
      </Grid>
    </Box>
  );
};

export default RecipeDiffInstructionsBlock;
