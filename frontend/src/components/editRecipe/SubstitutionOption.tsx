import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Grid,
  List,
  ListItem,
  Table,
  Typography,
} from "@mui/joy";
import type { GPAiSubstitutionReturnType } from "../../utils/types/aiSubReturnType";

type GPSubstitutionOptionType = {
  optionData: GPAiSubstitutionReturnType;
};

const SubstitutionOption = ({ optionData }: GPSubstitutionOptionType) => {
  return (
    <Box sx={{ mt: 2, mb: 4 }}>
      <Grid container>
        <Grid xs={2}>
          <Typography>
            Store Bought? {optionData.storeBought ? "✅" : "❌"}
          </Typography>
        </Grid>
        <Grid xs={6}>
          <Typography>{optionData.substitutionTitle}</Typography>
        </Grid>
        <Grid xs={2}>
          <Typography>{optionData.substitutionQuantity}</Typography>
        </Grid>
        <Grid xs={2}>
          <Typography>{optionData.substitutionUnit}</Typography>
        </Grid>
      </Grid>

      {optionData.substitutionIngredients.length > 0 &&
        optionData.substitutionInstructions.length > 0 && (
          <Accordion>
            <AccordionSummary>Instructions</AccordionSummary>
            <AccordionDetails>
              <Grid container>
                <Grid xs={6}>
                  <Table>
                    <thead>
                      <tr>
                        <th>Ingredient Name</th>
                        <th>Quantity</th>
                      </tr>
                    </thead>
                    <tbody>
                      {optionData.substitutionIngredients.map(
                        (ingredient, index) => (
                          <tr key={index}>
                            <td>{ingredient.ingredientName}</td>
                            <td>
                              {ingredient.quantity} {ingredient.unit}
                            </td>
                          </tr>
                        ),
                      )}
                    </tbody>
                  </Table>
                </Grid>
                <Grid xs={6}>
                  <List component="ol" marker="decimal">
                    {optionData.substitutionInstructions.map(
                      (instruction, index) => (
                        <ListItem key={index}>{instruction}</ListItem>
                      ),
                    )}
                  </List>
                </Grid>
              </Grid>
            </AccordionDetails>
          </Accordion>
        )}
    </Box>
  );
};

export default SubstitutionOption;
