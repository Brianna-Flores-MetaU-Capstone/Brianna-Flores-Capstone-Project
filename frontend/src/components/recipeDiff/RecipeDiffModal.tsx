import {
  Modal,
  ModalDialog,
  ModalClose,
  DialogContent,
  Typography,
  Box,
  Grid,
} from "@mui/joy";
import RecipeDiffBlock from "./RecipeDiffBlock";
import type { GPRecipeDiffType } from "../../utils/diffUtils";
import RecipeDiffInstructionsBlock from "./RecipeDiffInstructionsBlock";

const servingsStyle = {
  p: 1,
  borderRadius: "lg",
  display: "flex",
};

type GPRecipeDiffModalType = {
  modalOpen: boolean;
  toggleModal: () => void;
  recipeDiffData: GPRecipeDiffType | undefined;
};

const RecipeDiffModal = ({
  modalOpen,
  toggleModal,
  recipeDiffData,
}: GPRecipeDiffModalType) => {
  return (
    <Modal open={modalOpen} onClose={toggleModal}>
      <ModalDialog layout="fullscreen">
        <ModalClose />
        <DialogContent sx={{ my: 3 }}>
          <Grid container spacing={2}>
            <Grid xs={6}>
              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Box>
                  <Typography level="h2">
                    {recipeDiffData?.recipeA?.recipeTitle}
                  </Typography>
                  <Typography
                    sx={{
                      ...servingsStyle,
                      bgcolor: recipeDiffData?.servingsDiff
                        ? "success.200"
                        : "neutral",
                    }}
                    level="h4"
                  >
                    Servings: {recipeDiffData?.recipeA?.servings}
                  </Typography>
                </Box>
                <img src={recipeDiffData?.recipeA?.previewImage[0]} />
              </Box>
            </Grid>
            <Grid xs={6}>
              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Box>
                  <Typography level="h2">
                    {recipeDiffData?.recipeB?.recipeTitle}
                  </Typography>
                  <Typography
                    sx={{
                      ...servingsStyle,
                      bgcolor: recipeDiffData?.servingsDiff
                        ? "danger.200"
                        : "neutral",
                    }}
                    level="h4"
                  >
                    Servings: {recipeDiffData?.recipeB?.servings}
                  </Typography>
                </Box>
                <img src={recipeDiffData?.recipeB?.previewImage[0]} />
              </Box>
            </Grid>
          </Grid>
          <RecipeDiffBlock
            recipeA={recipeDiffData?.recipeA}
            recipeB={recipeDiffData?.recipeB}
            diffInfo={recipeDiffData?.recipeIngredientDiff}
            costDiff={false}
          />
          <RecipeDiffBlock
            recipeA={recipeDiffData?.recipeA}
            recipeB={recipeDiffData?.recipeB}
            diffInfo={recipeDiffData?.purchasedIngredientsDiff}
            costDiff={true}
          />
          <RecipeDiffInstructionsBlock
            recipeA={recipeDiffData?.recipeA}
            recipeB={recipeDiffData?.recipeB}
          />
        </DialogContent>
      </ModalDialog>
    </Modal>
  );
};

export default RecipeDiffModal;
