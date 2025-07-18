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
import RecipeDiffInfo from "./RecipeDiffInfo";

type GPRecipeDiffModalType = {
  modalOpen: boolean;
  toggleModal: () => void;
  diffData: GPDiffReturnType<GPIngredientDataTypes>;
  recipeA: GPRecipeDataTypes;
  recipeB: GPRecipeDataTypes;
};

const RecipeDiffModal = ({
  modalOpen,
  toggleModal,
  diffData,
  recipeA,
  recipeB,
}: GPRecipeDiffModalType) => {
  return (
    <Modal open={modalOpen} onClose={toggleModal}>
      <ModalDialog layout="fullscreen">
        <ModalClose />
        <DialogContent sx={{ my: 3 }}>
          <Box sx={{display: "flex", gap: 5}}>
            <RecipeDiffInfo first={true} recipe={recipeA} diffInfo={diffData} />
            <RecipeDiffInfo
              first={false}
              recipe={recipeB}
              diffInfo={diffData}
            />
          </Box>
        </DialogContent>
      </ModalDialog>
    </Modal>
  );
};

export default RecipeDiffModal;
