import {
  Modal,
  ModalDialog,
  ModalClose,
  DialogContent,
  Typography,
  Box,
} from "@mui/joy";
import type { GPIngredientDataTypes, GPRecipeDataTypes } from "../utils/types";
import type { GPDiffReturnType } from "../classes/DiffClass";
import RecipeDiffTable from "./RecipeDiffTable";

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
          <Box sx={{ display: "flex", gap: 5 }}>
            <Box>
              <Box display="flex" justifyContent="space-between">
                <Typography level="h2">{recipeA?.recipeTitle}</Typography>
                <img src={recipeA?.previewImage} />
              </Box>
              <RecipeDiffTable
                first={true}
                diffInfo={diffRecipeIngredinetsData}
                costDiff={false}
              />
              <RecipeDiffTable
                first={true}
                diffInfo={diffIngredientsToPurchaseData}
                costDiff={true}
              />
            </Box>
            <Box>
                <Box display="flex" justifyContent="space-between">
                <Typography level="h2">{recipeB?.recipeTitle}</Typography>
                <img src={recipeB?.previewImage} />
              </Box>
              <RecipeDiffTable
                first={false}
                diffInfo={diffRecipeIngredinetsData}
                costDiff={false}
              />
              <RecipeDiffTable
                first={false}
                diffInfo={diffIngredientsToPurchaseData}
                costDiff={true}
              />
            </Box>
          </Box>
        </DialogContent>
      </ModalDialog>
    </Modal>
  );
};

export default RecipeDiffModal;
