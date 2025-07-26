import type { GPRecipeComparisonReturnType } from "../../classes/recipeDiffClasses/DiffRecipeIngredients";
import type { GPIngredientDataTypes } from "../../utils/types/types";
import { Box, Table } from "@mui/joy";
import { formatQuantity } from "../../utils/utils";

type GPRecipeDiffInfo = {
  first: boolean;
  costDiff: boolean;
  diffInfo: GPRecipeComparisonReturnType<GPIngredientDataTypes> | undefined;
};

const RecipeDiffTable = ({ first, diffInfo, costDiff }: GPRecipeDiffInfo) => {
  return (
    <Box>
      <Table
        aria-label="recipe diff info"
        sx={{ "& thead th:nth-child(1)": { width: "30%" } }}
      >
        <thead>
          <tr>
            <th style={{ textAlign: "center" }}>Quantity</th>
            <th>Ingredient Name</th>
            {costDiff && <th>Estimated Cost</th>}
          </tr>
        </thead>
        <Box component="tbody">
          {diffInfo?.unchanged.map((ingredient, index) => (
            <Box bgcolor="success.200" component="tr" key={index}>
              <td style={{ textAlign: "center" }}>
                {formatQuantity(ingredient.quantity)} {ingredient.unit}
              </td>
              <td>{ingredient.ingredientName}</td>
              {costDiff && (
                <td>
                  ${ingredient.ingredientCost} for{" "}
                  {ingredient.ingredientCostUnit}
                </td>
              )}
            </Box>
          ))}

          {diffInfo?.changed.map((ingredient, index) => (
            <Box component="tr" bgcolor="neutral.50" key={index}>
              <td>
                <Box
                  sx={{
                    bgcolor: "",
                    borderRadius: "lg",
                    textAlign: "center",
                  }}
                >
                  {formatQuantity(
                    first
                      ? ingredient.itemA.quantity
                      : ingredient.itemB.quantity,
                  )}{" "}
                  {first ? ingredient.itemA.unit : ingredient.itemB.unit}
                </Box>
              </td>
              <td>
                {first
                  ? ingredient.itemA.ingredientName
                  : ingredient.itemB.ingredientName}
              </td>
              {costDiff && (
                <td>
                  {first
                    ? `$${ingredient.itemA.ingredientCost} for ${ingredient.itemA.ingredientCostUnit}`
                    : `$${ingredient.itemB.ingredientCost} for ${ingredient.itemB.ingredientCostUnit}`}
                </td>
              )}
            </Box>
          ))}
          {first &&
            diffInfo?.deleted.map((ingredient, index) => (
              <Box bgcolor="" component="tr" key={index}>
                <td style={{ textAlign: "center" }}>
                  {formatQuantity(ingredient.quantity)} {ingredient.unit}
                </td>
                <td>{ingredient.ingredientName}</td>
                {costDiff && (
                  <td>
                    ${ingredient.ingredientCost} for{" "}
                    {ingredient.ingredientCostUnit}
                  </td>
                )}
              </Box>
            ))}
          {!first &&
            diffInfo?.added.map((ingredient, index) => (
              <Box bgcolor="" component="tr" key={index}>
                <td style={{ textAlign: "center" }}>
                  {formatQuantity(ingredient.quantity)} {ingredient.unit}
                </td>
                <td>{ingredient.ingredientName}</td>
                {costDiff && (
                  <td>
                    ${ingredient.ingredientCost} for{" "}
                    {ingredient.ingredientCostUnit}
                  </td>
                )}
              </Box>
            ))}
        </Box>
      </Table>
    </Box>
  );
};

export default RecipeDiffTable;
