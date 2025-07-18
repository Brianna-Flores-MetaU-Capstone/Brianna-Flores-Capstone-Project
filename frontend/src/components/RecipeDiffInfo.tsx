import type { GPDiffReturnType } from "../classes/DiffClass";
import type { GPIngredientDataTypes, GPRecipeDataTypes } from "../utils/types";
import { Box, Typography, Table } from "@mui/joy";

type GPRecipeDiffInfo = {
  first: boolean;
  recipe: GPRecipeDataTypes;
  diffInfo: GPDiffReturnType<GPIngredientDataTypes>;
};

const RecipeDiffInfo = ({ first, recipe, diffInfo }: GPRecipeDiffInfo) => {
  const formatQuantity = (ingredientQuantity: number) => {
    return ingredientQuantity % 1 === 0
      ? ingredientQuantity
      : ingredientQuantity.toFixed(2);
  };

  return (
    <Box>
      <Box display="flex">
        <Typography level="h2">{recipe.recipeTitle}</Typography>
        <img src={recipe.previewImage} />
      </Box>

      <Table
        aria-label="recipe diff info"
        sx={{ "& thead th:nth-child(1)": { width: "30%" } }}
      >
        <thead>
          <tr>
            <th style={{ textAlign: "center" }}>Quantity</th>
            <th>Ingredient Name</th>
          </tr>
        </thead>
        <Box component="tbody">
          {diffInfo.unchanged.map((ingredient, index) => (
            <Box bgcolor="primary.200" component="tr" key={index}>
              <td style={{ textAlign: "center" }}>
                {formatQuantity(ingredient.quantity)} {ingredient.unit}
              </td>
              <td>{ingredient.ingredientName}</td>
            </Box>
          ))}

          {diffInfo.changed.map((ingredient, index) => (
            <Box component="tr" bgcolor="neutral.50" key={index}>
              <td>
                <Box
                  sx={{
                    bgcolor: "danger.200",
                    borderRadius: "lg",
                    textAlign: "center",
                  }}
                >
                  {formatQuantity(
                    first
                      ? ingredient.itemA.quantity
                      : ingredient.itemB.quantity
                  )}{" "}
                  {first ? ingredient.itemA.unit : ingredient.itemB.unit}
                </Box>
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
                <td style={{ textAlign: "center" }}>
                  {formatQuantity(ingredient.quantity)} {ingredient.unit}
                </td>
                <td>{ingredient.ingredientName}</td>
              </Box>
            ))}
          {!first &&
            diffInfo.added.map((ingredient, index) => (
              <Box bgcolor="danger.200" component="tr" key={index}>
                <td style={{ textAlign: "center" }}>
                  {formatQuantity(ingredient.quantity)} {ingredient.unit}
                </td>
                <td>{ingredient.ingredientName}</td>
              </Box>
            ))}
        </Box>
      </Table>
    </Box>
  );
};

export default RecipeDiffInfo;
