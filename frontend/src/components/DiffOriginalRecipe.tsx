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

import {
  DiffRecipes,
} from "../classes/DiffRecipe";

type GPDiffOriginalType = {
  originalRecipeInfo: GPRecipeDataTypes;
  editedRecipeInfo: GPRecipeDataTypes;
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
  ingredientsDiffResults: GPDiffLineInfoType[];
  instructionsDiffResults: GPDiffLineInfoType[];
};

const DiffOriginalRecipe = ({
  originalRecipeInfo,
  editedRecipeInfo,
  modalOpen,
  setModalOpen,
}: GPDiffOriginalType) => {
  const [recipeDiffInfo, setRecipeDiffInfo] =
    useState<GPOriginalRecipeDiffType>();
  const [message, setMessage] = useState<GPErrorMessageTypes>();

  useEffect(() => {
    const recipeDiff = new DiffRecipes(originalRecipeInfo, editedRecipeInfo)
    setRecipeDiffInfo(recipeDiff.getRecipeDiff())
  }, [modalOpen]);

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
          <Box>
            <Typography level="h2">
              {recipeDiffInfo?.titleDiffResults[0].lineDiffInfo?.map((word, index) => {
                if (word.status === DiffStatus.UNCHANGED) {
                  return (
                    <Box component="span" key={index}>
                      {word.line}{" "}
                    </Box>
                  );
                } else if (word.status === DiffStatus.ADDED) {
                  return (
                    <Box component="span" key={index} sx={GPDiffAddedStyle}>
                      {word.line}{" "}
                    </Box>
                  );
                } else {
                  return (
                    <Box component="s" key={index} sx={GPDiffDeletedStyle}>
                      {word.line}{" "}
                    </Box>
                  );
                }
              })}
            </Typography>
          </Box>
          <Box>
            <Typography level="h3">Instructions</Typography>
            <List marker="circle">
              {recipeDiffInfo?.ingredientsDiffResults.map((line, index) => {
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
                      <Box component="s">{line.line}</Box>
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
          </Box>
          <Box>
            <Typography level="h3">Instructions</Typography>
            <List component="ol" marker="decimal">
              {recipeDiffInfo?.instructionsDiffResults.map((line, index) => {
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
          </Box>
        </DialogContent>
      </ModalDialog>
    </Modal>
  );
};

export default DiffOriginalRecipe;
