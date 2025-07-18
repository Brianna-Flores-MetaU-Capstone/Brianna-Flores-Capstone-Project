import {
  Modal,
  ModalDialog,
  ModalClose,
  DialogContent,
  Typography,
  Box,
  Grid,
} from "@mui/joy";
import type { GPIngredientDataTypes, GPRecipeDataTypes } from "../utils/types";
import type { GPDiffReturnType } from "../classes/DiffClass";
import RecipeDiffBlock from "./RecipeDiffBlock";

type GPRecipeDiffModalType = {
  modalOpen: boolean;
  toggleModal: () => void;
  diffRecipeIngredinetsData: GPDiffReturnType<GPIngredientDataTypes>;
  diffIngredientsToPurchaseData: GPDiffReturnType<GPIngredientDataTypes>;
  recipeA: GPRecipeDataTypes;
  recipeB: GPRecipeDataTypes;
};

const RecipeDiffModal = ({
  modalOpen,
  toggleModal,
  diffRecipeIngredinetsData,
  diffIngredientsToPurchaseData,
  recipeA,
  recipeB,
}: GPRecipeDiffModalType) => {
  return (
    <Modal open={modalOpen} onClose={toggleModal}>
      <ModalDialog layout="fullscreen">
        <ModalClose />
        <DialogContent sx={{ my: 3 }}>
          <Grid container spacing={2}>
            <Grid xs={6}>
              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Typography level="h2">{recipeA?.recipeTitle}</Typography>
                <img src={recipeA?.previewImage} />
              </Box>
            </Grid>
            <Grid xs={6}>
              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Typography level="h2">{recipeB?.recipeTitle}</Typography>
                <img src={recipeB?.previewImage} />
              </Box>
            </Grid>
          </Grid>
          <RecipeDiffBlock
            recipeA={recipeA}
            recipeB={recipeB}
            diffInfo={diffRecipeIngredinetsData}
            costDiff={false}
          />
          <RecipeDiffBlock
            recipeA={recipeA}
            recipeB={recipeB}
            diffInfo={diffIngredientsToPurchaseData}
            costDiff={true}
          />
        </DialogContent>
      </ModalDialog>
    </Modal>
  );
};

export default RecipeDiffModal;
