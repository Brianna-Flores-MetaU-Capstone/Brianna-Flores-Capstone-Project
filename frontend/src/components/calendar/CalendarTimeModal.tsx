import React from "react";
import { useState, useEffect } from "react";
import type { GPRecipeEventOptionType } from "../../utils/types/types";
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
import { EventTimeEnum, ZERO_OUT_START_DATE } from "../../utils/constants";
import { useEventRec } from "../../contexts/EventRecContext";
import TimeBlock from "../../../../backend/classes/TimeBlock";
import {
  TimePreferenceString,
  type GPTimePreferenceType,
} from "../../../../shared/TimePreferenceString";
import CalendarTourTooltip from "./CalendarTourTooltip";
import {
  CalendarTimeModalAdjustTour,
  CalendarTimeModalPreferenceTour,
  CalendarTimeModalSinglePreferenceTour,
} from "../../utils/calendarTour/CalendarTourSteps";

type GPEventTimeModal = {
  editMode: boolean;
  eventInfo?: GPRecipeEventOptionType;
  groupNum?: number;
  modalOpen: boolean;
  toggleModal: () => void;
  onSubmit?: (
    preferredStartDate: string,
    preferences: TimePreferenceString[],
    singleDayPrep: boolean,
    servingsPerDay: number,
  ) => void;
  singleRecipe: boolean;
};

const CalendarTimeModal = ({
  editMode,
  eventInfo,
  groupNum,
  modalOpen,
  toggleModal,
  onSubmit,
  singleRecipe,
}: GPEventTimeModal) => {
  // Modal code referenced from https://mui.com/joy-ui/react-modal/
  const eventStartTime = new Date(eventInfo?.timeOptions[0].start ?? "");
  const eventEndTime = new Date(eventInfo?.timeOptions[0].end ?? "");

  const [start, setStart] = useState(
    eventStartTime.toLocaleTimeString([], {
      hour12: false,
      hour: "numeric",
      minute: "numeric",
    }),
  );
  const [end, setEnd] = useState(
    eventEndTime.toLocaleTimeString([], {
      hour12: false,
      hour: "numeric",
      minute: "numeric",
    }),
  );
  const [preferredTimeBlocks, setPreferredTimeBlocks] = useState<
    TimePreferenceString[]
  >([new TimePreferenceString()]);
  const [singleDayPrep, setSingleDayPrep] = useState(false);
  const [servingsPerDay, setServingsPerDay] = useState(1);
  const [date, setDate] = useState(
    eventStartTime.getFullYear() +
      "-" +
      (eventStartTime.getMonth() + 1).toString().padStart(2, "0") +
      "-" +
      eventStartTime.getDate().toString().padStart(2, "0"),
  );
  const [timeInputError, setTimeInputError] = useState(false);
  const [servingsInputError, setServingsInputError] = useState(false);
  const [dateInputError, setDateInputError] = useState(false);
  const [tourActive, setTourActive] = useState(true);
  const { eventOptions } = useEventRec();

  const handleTimeChange = (
    index: number,
    timeField: string,
    newValue: string,
  ) => {
    if (timeField === EventTimeEnum.START) {
      setStart(newValue);
    } else if (timeField === EventTimeEnum.END) {
      setEnd(newValue);
    } else if (timeField === EventTimeEnum.DATE) {
      setDate(newValue);
    }
    if (!editMode) {
      setPreferredTimeBlocks((prev) => {
        const updatedBlocks = [...prev];
        updatedBlocks[index].setTime(
          timeField as GPTimePreferenceType,
          newValue,
        );
        return updatedBlocks;
      });
    }
  };

  useEffect(() => {
    if (modalOpen) {
      setTourActive(true);
    }
  }, [modalOpen]);

  useEffect(() => {
    setTimeInputError(start > end);
  }, [start, end]);

  useEffect(() => {
    setServingsInputError(servingsPerDay < 1);
  }, [servingsPerDay]);

  useEffect(() => {
    const userInputDate = new Date(`${date}${ZERO_OUT_START_DATE}`);
    const todayDate = new Date();
    todayDate.setHours(0, 0, 0, 0);
    setDateInputError(userInputDate.getTime() < todayDate.getTime());
  }, [date]);

  const onEditTimeSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    // set event start time to new date if changed
    eventStartTime.setDate(parseInt(date.substring(8, 10)));
    eventStartTime.setMonth(parseInt(date.substring(5, 7)) - 1);
    eventEndTime.setDate(parseInt(date.substring(8, 10)));
    eventEndTime.setMonth(parseInt(date.substring(5, 7)) - 1);

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
      onSubmit(date, preferredTimeBlocks, singleDayPrep, servingsPerDay);
    }
    // when preferences submitted, zero out everything
    setPreferredTimeBlocks([new TimePreferenceString()]);
    setServingsPerDay(1);
    setDate("");
    toggleModal();
  };

  const addAnotherTimeBlock = () => {
    setPreferredTimeBlocks((prev) => [...prev, new TimePreferenceString()]);
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
            <FormControl error={dateInputError}>
              <FormLabel>
                {editMode ? "New Date" : "Begin Scheduling Events From"}
              </FormLabel>
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
                  root: {
                    id: "eventDateInput",
                  },
                }}
                required
              />
              {dateInputError && (
                <FormHelperText>
                  <InfoOutlined />
                  Date cannot be in the past
                </FormHelperText>
              )}
            </FormControl>
            {preferredTimeBlocks.map((block, index) => (
              <Box key={index}>
                <FormControl error={timeInputError}>
                  <FormLabel>{editMode ? "New Start Time" : "From"}</FormLabel>
                  <Input
                    type="time"
                    onChange={(event) =>
                      handleTimeChange(
                        index,
                        EventTimeEnum.START,
                        event.target.value,
                      )
                    }
                    value={editMode ? start : block.start}
                    slotProps={{
                      input: {
                        "data-time": EventTimeEnum.START,
                      },
                      root: {
                        id: "eventTimeInput",
                      },
                    }}
                    required
                  />
                </FormControl>
                <FormControl error={timeInputError}>
                  <FormLabel>{editMode ? "New End Time" : "To"}</FormLabel>
                  <Input
                    type="time"
                    onChange={(event) =>
                      handleTimeChange(
                        index,
                        EventTimeEnum.END,
                        event.target.value,
                      )
                    }
                    value={editMode ? end : block.end}
                    slotProps={{
                      input: {
                        "data-time": EventTimeEnum.END,
                      },
                      root: {
                        id: "eventTimeInput",
                      },
                    }}
                    required
                  />
                  {timeInputError && (
                    <FormHelperText>
                      <InfoOutlined />
                      End time must be after start
                    </FormHelperText>
                  )}
                </FormControl>
                {!editMode && (
                  <IconButton
                    id="eventAddTimeblock"
                    onClick={addAnotherTimeBlock}
                  >
                    <AddCircleOutlineIcon />
                  </IconButton>
                )}
              </Box>
            ))}
            {!editMode && !singleRecipe && (
              <Box>
                <ButtonGroup
                  id="eventSchedulingMode"
                  color="primary"
                  sx={{ my: 2 }}
                  buttonFlex={1}
                  size="lg"
                  spacing={2}
                >
                  <Button
                    id="cookThroughoutWeekButton"
                    variant={!singleDayPrep ? "solid" : "outlined"}
                    onClick={() => setSingleDayPrep(false)}
                  >
                    Cook throughout the week
                  </Button>
                  <Button
                    id="cookSingleDayButton"
                    variant={singleDayPrep ? "solid" : "outlined"}
                    onClick={() => setSingleDayPrep(true)}
                  >
                    Cook on a single day
                  </Button>
                </ButtonGroup>
                <FormControl error={servingsInputError}>
                  <FormLabel>Servings eaten per day</FormLabel>
                  <Input
                    type="number"
                    onChange={(event) =>
                      setServingsPerDay(parseInt(event.target.value))
                    }
                    slotProps={{
                      root: {
                        id: "servingsPerDay",
                      },
                    }}
                    value={servingsPerDay}
                    required
                  />
                  {servingsInputError && (
                    <FormHelperText>
                      <InfoOutlined />
                      Servings must be greater than 1
                    </FormHelperText>
                  )}
                </FormControl>
              </Box>
            )}
            <Button
              type="submit"
              disabled={timeInputError || servingsInputError || dateInputError}
              sx={{ display: "flex", mx: "auto", mt: 2 }}
            >
              {editMode ? "Adjust Time" : "Submit Preferences!"}
            </Button>
          </form>
          <CalendarTourTooltip
            tourSteps={
              editMode
                ? CalendarTimeModalAdjustTour
                : singleRecipe
                  ? CalendarTimeModalSinglePreferenceTour
                  : CalendarTimeModalPreferenceTour
            }
            tourActive={tourActive}
            onClose={() => setTourActive(false)}
          />
        </Sheet>
      </Modal>
    </React.Fragment>
  );
};

export default CalendarTimeModal;
