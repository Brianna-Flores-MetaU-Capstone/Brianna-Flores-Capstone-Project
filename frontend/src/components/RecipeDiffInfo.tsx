import type { GPDiffReturnType } from "../classes/DiffClass";
import type { GPIngredientDataTypes, GPRecipeDataTypes } from "../utils/types";
import { Box, Typography, Table } from "@mui/joy";

type GPRecipeDiffInfo = {
  first: boolean;
  recipe: GPRecipeDataTypes;
  diffInfo: GPDiffReturnType<GPIngredientDataTypes>;
};

const RecipeDiffInfo = ({ first, recipe, diffInfo }: GPRecipeDiffInfo) => {
  return (
    <Box>
        <Box display="flex">
      <Typography level="h2">{recipe.recipeTitle}</Typography>
            <img src={recipe.previewImage}/>
        </Box>

      <Table aria-label="recipe diff info">
        <thead>
          <tr>
            <th>Quantity</th>
            <th>Ingredient Name</th>
          </tr>
        </thead>
        <tbody>
          {diffInfo.unchanged.map((ingredient, index) => (
            <Box bgcolor="primary.200" component="tr" key={index}>
              <td>
                {ingredient.quantity} {ingredient.unit}
              </td>
              <td>{ingredient.ingredientName}</td>
            </Box>
          ))}

          {diffInfo.changed.map((ingredient, index) => (
            <Box bgcolor="neutral.200" component="tr" key={index}>
              <td>
                {first ? ingredient.itemA.quantity : ingredient.itemB.quantity}{" "}
                {first ? ingredient.itemA.unit : ingredient.itemB.unit}
              </td>
              <td>
                {first
                  ? ingredient.itemA.ingredientName
                  : ingredient.itemB.ingredientName}
              </td>
            </Box>
          ))}
          {first &&
            diffInfo.deleted.map((ingredient, index) => (
              <Box bgcolor="success.200" component="tr" key={index}>
                <td>
                  {ingredient.quantity} {ingredient.unit}
                </td>
                <td>{ingredient.ingredientName}</td>
              </Box>
            ))}
          {!first &&
            diffInfo.added.map((ingredient, index) => (
              <Box bgcolor="danger.200" component="tr" key={index}>
                <td>
                  {ingredient.quantity} {ingredient.unit}
                </td>
                <td>{ingredient.ingredientName}</td>
              </Box>
            ))}
        </tbody>
      </Table>
    </Box>
  );
};

export default RecipeDiffInfo;
