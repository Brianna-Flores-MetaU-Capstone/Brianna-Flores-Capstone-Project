import { useState } from "react";
import type { GPRecipeEventOptionType } from "../../utils/types";
import {
  Button,
  Box,
  Card,
  ButtonGroup,
  CardContent,
  Typography,
  AspectRatio,
  Tooltip,
} from "@mui/joy";
import { DaysOfWeek } from "../../utils/enum";
import CalendarTimeModal from "./CalendarTimeModal";
import { useSelectedEvents } from "../../contexts/SelectedEventsContext";
import TimeBlock from "../../../../backend/classes/TimeBlock";

type GPCalendarOption = {
  eventOption: GPRecipeEventOptionType;
  groupNum: number;
};

const CalendarEventCard = ({ eventOption, groupNum }: GPCalendarOption) => {
  const [modalOpen, setModalOpen] = useState(false);
  const recipe = eventOption.recipe;
  const startDate = new Date(eventOption.timeOptions[0].start);
  const { selectedEvents, setSelectedEvents } = useSelectedEvents();

  const toggleSelection = (timeBlock: TimeBlock) => {
    const clickedEvent = {
      ...eventOption,
      timeOptions: [timeBlock],
    };
    // if not already in the set, add
    const isSelected = selectedEvents.filter(
      (selectedEvent) =>
        selectedEvent.name === clickedEvent.name &&
        selectedEvent.timeOptions[0].start ===
          clickedEvent.timeOptions[0].start &&
        selectedEvent.timeOptions[0].end === clickedEvent.timeOptions[0].end,
    );
    if (isSelected.length === 0) {
      setSelectedEvents((prev) => [...prev, clickedEvent]);
    } else {
      setSelectedEvents((prev) =>
        prev.filter(
          (selectedEvent) =>
            selectedEvent.name !== clickedEvent.name &&
            selectedEvent.timeOptions[0].start !==
              clickedEvent.timeOptions[0].start &&
            selectedEvent.timeOptions[0].end !==
              clickedEvent.timeOptions[0].end,
        ),
      );
    }
  };

  return (
    <Card sx={{ width: 350 }}>
      <Box>
        <Typography
          level="title-lg"
          sx={{
            textAlign: "center",
            width: "100%",
          }}
        >
          {DaysOfWeek[startDate.getDay()]}
        </Typography>
        <Typography
          level="title-lg"
          sx={{
            textAlign: "center",
            textWrap: "nowrap",
            overflow: "hidden",
            whiteSpace: "nowrap",
            textOverflow: "ellipsis",
          }}
        >
          {recipe.recipeTitle}
        </Typography>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Typography level="body-md">
            Cook Time: {recipe.readyInMinutes}
          </Typography>
          <Typography level="body-md">Servings: {recipe.servings}</Typography>
        </Box>
      </Box>
      <AspectRatio minHeight="120px" maxHeight="200px">
        <img
          src={recipe.previewImage}
          srcSet={recipe.previewImage}
          loading="lazy"
          alt=""
        />
      </AspectRatio>
      <CardContent orientation="horizontal">
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
          }}
        >
          <Box>
            <Typography level="body-sm">{startDate.toDateString()}</Typography>
            <ButtonGroup color="primary" size="sm">
              {eventOption.timeOptions.map((option, index) => {
                const formattedStart = new Date(option.start)
                  .toLocaleTimeString([], {
                    hour: "numeric",
                    minute: "numeric",
                  })
                  .replace(" PM", "")
                  .replace(" AM", "");
                const formattedEnd = new Date(option.end).toLocaleTimeString(
                  [],
                  {
                    hour: "numeric",
                    minute: "numeric",
                  },
                );
                const clickedEvent: GPRecipeEventOptionType = {
                  ...eventOption,
                  timeOptions: [option],
                };
                const isSelected = selectedEvents.filter(
                  (selectedEvent) =>
                    selectedEvent.name === clickedEvent.name &&
                    selectedEvent.timeOptions[0].start ===
                      clickedEvent.timeOptions[0].start &&
                    selectedEvent.timeOptions[0].end ===
                      clickedEvent.timeOptions[0].end,
                );
                return (
                  <Tooltip key={index} title="Select time">
                    <Button
                      variant={isSelected.length === 0 ? "outlined" : "solid"}
                      onClick={() => toggleSelection(option)}
                      key={index}
                    >
                      {formattedStart}-{formattedEnd}
                    </Button>
                  </Tooltip>
                );
              })}
              <Button onClick={() => setModalOpen(true)}>Adjust Time</Button>
            </ButtonGroup>
          </Box>
          <CalendarTimeModal
            editMode={true}
            eventInfo={eventOption}
            groupNum={groupNum}
            modalOpen={modalOpen}
            toggleModal={() => setModalOpen((prev) => !prev)}
          />
        </Box>
      </CardContent>
    </Card>
  );
};

export default CalendarEventCard;
