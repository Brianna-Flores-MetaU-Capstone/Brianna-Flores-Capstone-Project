import React from "react";
import { useState, useEffect } from "react";
import type {
  GPPreferredBlockType,
  GPRecipeEventOptionType,
} from "../../utils/types";
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
  ButtonGroup,
} from "@mui/joy";
import InfoOutlined from "@mui/icons-material/InfoOutline";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { EventTimeEnum } from "../../utils/constants";
import { useEventRec } from "../../contexts/EventRecContext";
import TimeBlock from "../../../../backend/classes/TimeBlock";

type GPEventTimeModal = {
  editMode: boolean;
  eventInfo?: GPRecipeEventOptionType;
  groupNum?: number;
  modalOpen: boolean;
  toggleModal: () => void;
  onSubmit?: (
    preferences: GPPreferredBlockType[],
    singleDayPrep: boolean,
    servingsPerDay: number
  ) => void;
};

const CalendarTimeModal = ({
  editMode,
  eventInfo,
  groupNum,
  modalOpen,
  toggleModal,
  onSubmit,
}: GPEventTimeModal) => {
  // Modal code referenced from https://mui.com/joy-ui/react-modal/
  const eventStartTime = new Date(eventInfo?.timeOptions[0].start ?? "");
  const eventEndTime = new Date(eventInfo?.timeOptions[0].end ?? "");

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
  const [preferredTimeBlocks, setPreferredTimeBlocks] = useState<
    GPPreferredBlockType[]
  >([{ start: "", end: "" }]);
  const [singleDayPrep, setSingleDayPrep] = useState(false);
  const [servingsPerDay, setServingsPerDay] = useState(1);
  const [date, setDate] = useState(
    eventStartTime.getFullYear() +
      "-" +
      eventStartTime.getMonth().toString().padStart(2, "0") +
      "-" +
      eventStartTime.getDate().toString().padStart(2, "0")
  );
  const { eventOptions, setEventOptions } = useEventRec();

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
      } else if (timeField === EventTimeEnum.DATE) {
        setDate(newValue);
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
    // set event start time to new date if changed
    eventStartTime.setDate(parseInt(date.substring(8, 10)));
    eventStartTime.setMonth(parseInt(date.substring(5, 7)));
    eventEndTime.setDate(parseInt(date.substring(8, 10)));
    eventEndTime.setMonth(parseInt(date.substring(5, 7)));

    eventStartTime.setHours(parseInt(start.substring(0, 2)));
    eventStartTime.setMinutes(parseInt(start.substring(3)));
    eventEndTime.setHours(parseInt(end.substring(0, 2)));
    eventEndTime.setMinutes(parseInt(end.substring(3)));
    if (eventInfo && groupNum !== undefined && eventOptions) {
      eventInfo.timeOptions[0] = new TimeBlock(eventStartTime, eventEndTime);
      toggleModal();
    }
  };

  const onSubmitPreferences = (event: React.FormEvent) => {
    event.preventDefault();
    if (onSubmit) {
      onSubmit(preferredTimeBlocks, singleDayPrep, servingsPerDay);
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
            {editMode && (
              <FormControl error={inputError}>
                <FormLabel>New Date</FormLabel>
                <Input
                  type="date"
                  onChange={(event) =>
                    handleTimeChange(0, EventTimeEnum.DATE, event.target.value)
                  }
                  value={date}
                  slotProps={{
                    input: {
                      "data-time": EventTimeEnum.DATE,
                    },
                  }}
                  required
                />
              </FormControl>
            )}
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
                    value={editMode ? start : block.start}
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
                    onChange={(event) =>
                      handleTimeChange(
                        index,
                        EventTimeEnum.END,
                        event.target.value
                      )
                    }
                    value={editMode ? end : block.end}
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
            {!editMode && (
              <Box>
                <ButtonGroup
                  color="primary"
                  sx={{ my: 2 }}
                  buttonFlex={1}
                  size="lg"
                >
                  <Button
                    variant={!singleDayPrep ? "solid" : "outlined"}
                    onClick={() => setSingleDayPrep(false)}
                  >
                    Cook throughout the week
                  </Button>
                  <Button
                    variant={singleDayPrep ? "solid" : "outlined"}
                    onClick={() => setSingleDayPrep(true)}
                  >
                    Cook on a single day
                  </Button>
                </ButtonGroup>

                <FormControl error={inputError}>
                  <FormLabel>Servings eaten per day</FormLabel>
                  <Input
                    type="number"
                    onChange={(event) =>
                      setServingsPerDay(parseInt(event.target.value))
                    }
                    value={servingsPerDay}
                    required
                  />
                  {inputError && (
                    <FormHelperText>
                      <InfoOutlined />
                      End time must be after start
                    </FormHelperText>
                  )}
                </FormControl>
              </Box>
            )}
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

export default CalendarTimeModal;
