import React from "react";
import { useState, useEffect } from "react";
import type {
  GPPreferredBlockType,
  GPRecipeEventOptionType,
} from "../utils/types";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Modal,
  ModalClose,
  Sheet,
  Typography,
  FormHelperText,
  IconButton,
} from "@mui/joy";
import InfoOutlined from "@mui/icons-material/InfoOutline";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { EventTimeEnum } from "../utils/constants";
import { useEventRec } from "../contexts/EventRecContext";

type GPEventTimeModal = {
  editMode: boolean;
  eventInfo?: GPRecipeEventOptionType;
  groupNum?: number;
  modalOpen: boolean;
  toggleModal: () => void;
  onSubmit?: (preferences: GPPreferredBlockType[]) => void
};

const AdjustEventTimeModal = ({
  editMode,
  eventInfo,
  groupNum,
  modalOpen,
  toggleModal,
  onSubmit
}: GPEventTimeModal) => {
  // Modal code referenced from https://mui.com/joy-ui/react-modal/
  const eventStartTime = new Date(eventInfo?.start ?? "");
  const eventEndTime = new Date(eventInfo?.end ?? "");
  const [start, setStart] = useState(
    eventStartTime.toLocaleTimeString([], {
      hour12: false,
      hour: "numeric",
      minute: "numeric",
    })
  );
  const [end, setEnd] = useState(
    eventEndTime.toLocaleTimeString([], {
      hour12: false,
      hour: "numeric",
      minute: "numeric",
    })
  );
  const [inputError, setInputError] = useState(false);
  const { eventOptions, setEventOptions } = useEventRec();
  const [preferredTimeBlocks, setPreferredTimeBlocks] = useState<GPPreferredBlockType[]>([
    { start: "", end: "" },
  ]);

  const handleTimeChange = (
    index: number,
    timeField: string,
    newValue: string
  ) => {
    if (editMode) {
      if (timeField === EventTimeEnum.START) {
        setStart(newValue);
      } else if (timeField === EventTimeEnum.END) {
        setEnd(newValue);
      }
    } else {
      setPreferredTimeBlocks((prev) => {
        const updatedBlocks = [...prev];
        updatedBlocks[index] = {
          ...updatedBlocks[index],
          [timeField]: newValue,
        };
        return updatedBlocks;
      });
    }
  };

  useEffect(() => {
    setInputError(start > end);
  }, [start, end]);

  const onEditTimeSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    eventStartTime.setHours(parseInt(start.substring(0, 2)));
    eventStartTime.setMinutes(parseInt(start.substring(3)));
    eventEndTime.setHours(parseInt(end.substring(0, 2)));
    eventEndTime.setMinutes(parseInt(end.substring(3)));
    if (eventInfo && groupNum !== undefined && eventOptions) {
      const updatedEvent = {
        ...eventInfo,
        start: eventStartTime,
        end: eventEndTime,
      };
      setEventOptions((prev) => {
        const updatedEventOptions = [...prev];
        updatedEventOptions[groupNum] = prev[groupNum].map((eventInfo) =>
          eventInfo.name === updatedEvent.name ? updatedEvent : eventInfo
        );
        return updatedEventOptions;
      });
      toggleModal();
    }
  };

  const onSubmitPreferences = (event: React.FormEvent) => {
    event.preventDefault();
    if (onSubmit) {
      onSubmit(preferredTimeBlocks)
    }
    toggleModal();
  };

  const addAnotherTimeBlock = () => {
    setPreferredTimeBlocks((prev) => [...prev, { start: "", end: "" }]);
  };

  return (
    <React.Fragment>
      <Modal
        aria-labelledby="adjust-event-time-modal"
        open={modalOpen}
        onClose={toggleModal}
        sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}
      >
        <Sheet
          variant="outlined"
          sx={{ width: 400, borderRadius: "md", p: 3, boxShadow: "lg" }}
        >
          <ModalClose variant="plain" sx={{ m: 1 }} />
          <Typography
            component="h2"
            id="modal-title"
            level="h4"
            textColor="inherit"
            sx={{ fontWeight: "lg", mb: 1 }}
          >
            {editMode ? "Adjust Event Time" : "Input Preferred Time to Cook"}
          </Typography>
          <form onSubmit={editMode ? onEditTimeSubmit : onSubmitPreferences}>
            {preferredTimeBlocks.map((block, index) => (
              <Box key={index}>
                <FormControl error={inputError}>
                  <FormLabel>{editMode ? "New Start Time" : "From"}</FormLabel>
                  <Input
                    type="time"
                    onChange={(event) =>
                      handleTimeChange(
                        index,
                        EventTimeEnum.START,
                        event.target.value
                      )
                    }
                    value={editMode ? start : preferredTimeBlocks[index].start}
                    slotProps={{
                      input: {
                        "data-time": EventTimeEnum.START,
                      },
                    }}
                    required
                  />
                </FormControl>
                <FormControl error={inputError}>
                  <FormLabel>{editMode ? "New End Time" : "To"}</FormLabel>
                  <Input
                    type="time"
                    onChange={(event) => handleTimeChange(index, EventTimeEnum.END, event.target.value)}
                    value={editMode ? end : preferredTimeBlocks[index].end}
                    slotProps={{
                      input: {
                        "data-time": EventTimeEnum.END,
                      },
                    }}
                    required
                  />
                  {inputError && (
                    <FormHelperText>
                      <InfoOutlined />
                      End time must be after start
                    </FormHelperText>
                  )}
                </FormControl>
                {!editMode && (
                  <IconButton onClick={addAnotherTimeBlock}>
                    <AddCircleOutlineIcon />
                  </IconButton>
                )}
              </Box>
            ))}
            <Button
              type="submit"
              disabled={inputError}
              sx={{ display: "flex", mx: "auto", mt: 2 }}
            >
              {editMode ? "Adjust Time" : "Submit Preferences!"}
            </Button>
          </form>
        </Sheet>
      </Modal>
    </React.Fragment>
  );
};

export default AdjustEventTimeModal;
