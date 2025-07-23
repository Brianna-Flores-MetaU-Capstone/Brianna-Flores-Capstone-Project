import type { GPIngredientDataTypes } from "../../utils/types/types";
import TitledListView from "../utils/TitledListView";
import IngredientCost from "../ingredients/IngredientCost";
import { Box, Modal, ModalClose, Typography, Sheet } from "@mui/joy";
import { ColumnOverflowTitledListStyle } from "../../utils/style/UIStyle";

type GPRecipeCostModalTypes = {
  ingredientsCostInformation: GPIngredientDataTypes[];
  totalCost: number;
  modalOpen: boolean;
  onClose: () => void;
};
const RecipeCostModal = ({
  ingredientsCostInformation,
  totalCost,
  modalOpen,
  onClose,
}: GPRecipeCostModalTypes) => {
  return (
    // Code based on MUI documentation: https://mui.com/joy-ui/react-modal/
    <Modal
      aria-labelledby="Loading"
      aria-describedby="loading screen"
      open={modalOpen}
      onClose={onClose}
      sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}
    >
      <Sheet
        variant="outlined"
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          width: "80%",
          maxWidth: 700,
          borderRadius: "md",
          p: 3,
          boxShadow: "lg",
          height: "50%",
        }}
      >
        <ModalClose variant="plain" sx={{ m: 1 }} />
        <Typography
          component="h2"
          id="modal-title"
          level="h2"
          textColor="inherit"
          sx={{ fontWeight: "lg", mb: 1 }}
        >
          Ingredient Cost Information
        </Typography>
        <Box sx={{ width: "100%" }}>
          <Box>
          <TitledListView
            headerList={[
              { title: "Ingredient", spacing: 8 },
              { title: "Cost", spacing: 2 },
              { title: "For Amount", spacing: 2 },
            ]}
            itemsList={ingredientsCostInformation}
            renderItem={(ingredientInfo, index) => (
              <IngredientCost key={index} ingredientCostInfo={ingredientInfo} />
            )}
            listItemsStyle={ColumnOverflowTitledListStyle}
          />
          </Box>
          <Typography level="h3">Total Cost</Typography>
          <Typography>${totalCost.toFixed(2)}</Typography>
        </Box>
      </Sheet>
    </Modal>
  );
};

export default RecipeCostModal;
