import { useState } from "react";
import type { GPRecipeDataTypes } from "../utils/types";
import type { GPDiffLineInfoType } from "../utils/diffUtils";
import { DiffStatus } from "../utils/diffUtils";
import {
  Box,
  Modal,
  ModalClose,
  ModalDialog,
  DialogContent,
  Typography,
} from "@mui/joy";

type GPDiffOriginalType = {
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

const DiffOriginalRecipe = ({
  instructionsDiffInfo,
  ingredientsDiffInfo,
  modalOpen,
  setModalOpen,
}: GPDiffOriginalType) => {
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
          <Typography>Instructions Diff</Typography>
          {instructionsDiffInfo.map((line, index) => {
            if (line.status === DiffStatus.UNCHANGED) {
              return <Typography key={index}>{line.line}</Typography>;
            } else if (line.status === DiffStatus.ADDED) {
              return (
                <Typography key={index} sx={GPDiffAddedStyle}>
                  {line.line}
                </Typography>
              );
            } else if (line.status === DiffStatus.DELETED) {
              return (
                <Typography key={index} sx={GPDiffDeletedStyle}>
                  {line.line}
                </Typography>
              );
            } else {
              return (
                <Typography key={index}>
                  {line.lineDiffInfo?.map((word, wordIndex) => {
                    if (word.status === DiffStatus.UNCHANGED) {
                      return (
                        <Typography key={wordIndex}>{word.line} </Typography>
                      );
                    } else if (word.status === DiffStatus.ADDED) {
                      return (
                        <Typography key={wordIndex} sx={GPDiffAddedStyle}>
                          {word.line}{" "}
                        </Typography>
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
                </Typography>
              );
            }
          })}
        </DialogContent>
      </ModalDialog>
    </Modal>
  );
};

export default DiffOriginalRecipe;
