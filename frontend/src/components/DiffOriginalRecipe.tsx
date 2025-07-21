import { useState, useEffect } from "react";
import type { GPErrorMessageTypes, GPRecipeDataTypes } from "../utils/types";
import type { GPDiffLineInfoType } from "../utils/diffUtils";
import { DiffStatus } from "../utils/diffUtils";
import {
  AspectRatio,
  List,
  ListItem,
  Box,
  Modal,
  ModalClose,
  ModalDialog,
  DialogContent,
  Typography,
} from "@mui/joy";

type GPDiffOriginalType = {
  originalRecipeInfo: GPRecipeDataTypes;
  editedRecipeInfo: GPRecipeDataTypes;
  instructionsDiffInfo: GPDiffLineInfoType[];
  ingredientsDiffInfo: GPDiffLineInfoType[];
  modalOpen: boolean;
  setModalOpen: () => void;
};

const GPDiffStyle = {
  borderRadius: "md",
  padding: 0.5,
};
const GPDiffAddedStyle = {
  ...GPDiffStyle,
  bgcolor: "success.200",
};
const GPDiffDeletedStyle = {
  ...GPDiffStyle,
  bgcolor: "danger.200",
};

type GPOriginalRecipeDiffType = {
  titleDiffResults: GPDiffLineInfoType[];
  servingsDiffResults: GPDiffLineInfoType;
  ingredientsDiffResults: GPDiffLineInfoType[];
  instructionsDiffResults: GPDiffLineInfoType[];
};

const DiffOriginalRecipe = ({
  originalRecipeInfo,
  editedRecipeInfo,
  instructionsDiffInfo,
  ingredientsDiffInfo,
  modalOpen,
  setModalOpen,
}: GPDiffOriginalType) => {
  const [recipeDiffInfo, setRecipeDiffInfo] =
    useState<GPOriginalRecipeDiffType>();
  const [message, setMessage] = useState<GPErrorMessageTypes>();

  return (
    <Modal
      aria-labelledby="modal-title"
      aria-describedby="modal-desc"
      open={modalOpen}
      onClose={setModalOpen}
    >
      <ModalDialog layout="fullscreen">
        <ModalClose variant="plain" sx={{ zIndex: 2, m: 1 }} />
        <DialogContent sx={{ my: 4 }}>
          <AspectRatio ratio="1" sx={{ width: "50%", borderRadius: "md" }}>
            <img src={originalRecipeInfo.previewImage} />
          </AspectRatio>
          <Typography level="h3">Instructions</Typography>
          <List component="ol" marker="decimal">
            {instructionsDiffInfo.map((line, index) => {
              if (line.status === DiffStatus.UNCHANGED) {
                return <ListItem key={index}>{line.line}</ListItem>;
              } else if (line.status === DiffStatus.ADDED) {
                return (
                  <ListItem key={index} sx={GPDiffAddedStyle}>
                    {line.line}
                  </ListItem>
                );
              } else if (line.status === DiffStatus.DELETED) {
                return (
                  <ListItem key={index} sx={GPDiffDeletedStyle}>
                    {line.line}
                  </ListItem>
                );
              } else {
                return (
                  <ListItem key={index}>
                    {line.lineDiffInfo?.map((word, wordIndex) => {
                      if (word.status === DiffStatus.UNCHANGED) {
                        return (
                          <Box component="span" key={wordIndex}>
                            {word.line}{" "}
                          </Box>
                        );
                      } else if (word.status === DiffStatus.ADDED) {
                        return (
                          <Box
                            component="span"
                            key={wordIndex}
                            sx={GPDiffAddedStyle}
                          >
                            {word.line}{" "}
                          </Box>
                        );
                      } else {
                        return (
                          <Box
                            component="s"
                            key={wordIndex}
                            sx={GPDiffDeletedStyle}
                          >
                            {word.line}{" "}
                          </Box>
                        );
                      }
                    })}
                  </ListItem>
                );
              }
            })}
          </List>
        </DialogContent>
      </ModalDialog>
    </Modal>
  );
};

export default DiffOriginalRecipe;
