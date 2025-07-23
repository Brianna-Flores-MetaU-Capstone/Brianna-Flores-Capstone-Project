import type { GPRecipeDataTypes } from "../utils/types";
import { Box, Grid, Typography, List, ListItem } from "@mui/joy";

type GPInstructionsDiffTypes = {
  recipeA: GPRecipeDataTypes;
  recipeB: GPRecipeDataTypes;
};

const RecipeDiffInstructionsBlock = ({
  recipeA,
  recipeB,
}: GPInstructionsDiffTypes) => {
  return (
    <Box>
      <Typography sx={{mt: 3, bgcolor: "primary.200", p: 2, borderRadius: "lg"}} level="h2">Compare Instructions</Typography>
      <Grid container spacing={2}>
        <Grid xs={6}>
          <List component="ol" marker="decimal">
            {recipeA.instructions.map((step, index) => {
              return <ListItem key={index}>{step}</ListItem>;
            })}
          </List>
        </Grid>
        <Grid xs={6}>
          <List component="ol" marker="decimal">
            {recipeB.instructions.map((step, index) => {
              return <ListItem key={index}>{step}</ListItem>;
            })}
          </List>
        </Grid>
      </Grid>
    </Box>
  );
};

export default RecipeDiffInstructionsBlock;
