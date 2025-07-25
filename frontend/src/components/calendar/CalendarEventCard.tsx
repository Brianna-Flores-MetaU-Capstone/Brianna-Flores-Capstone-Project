import { useState } from "react";
import type { GPRecipeEventOptionType } from "../../utils/types/types";
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
            selectedEvent.name !== clickedEvent.name ||
            selectedEvent.timeOptions[0].start !==
              clickedEvent.timeOptions[0].start ||
            selectedEvent.timeOptions[0].end !==
              clickedEvent.timeOptions[0].end,
        ),
      );
    }
  };

  return (
    <Card id="eventCard" sx={{ width: 350 }}>
      <Box>
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
            Cook Time: {recipe.readyInMinutes} minutes
          </Typography>
          <Typography level="body-md">Servings: {recipe.servings}</Typography>
        </Box>
      </Box>
      <AspectRatio minHeight="120px" maxHeight="200px">
        <img
          src={recipe.previewImage[0]}
          srcSet={recipe.previewImage[0]}
          loading="lazy"
          alt=""
        />
      </AspectRatio>
      <CardContent
        orientation="horizontal"
        sx={{ display: "flex", justifyContent: "center" }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "100%",
          }}
        >
          <ButtonGroup
            sx={{ width: "100%" }}
            color="primary"
            orientation="vertical"
            size="sm"
            spacing={1}
          >
            {eventOption.timeOptions.map((option, index) => {
              const formattedStart = new Date(option.start).toLocaleTimeString(
                [],
                {
                  hour: "numeric",
                  minute: "numeric",
                },
              );
              const formattedEnd = new Date(option.end).toLocaleTimeString([], {
                hour: "numeric",
                minute: "numeric",
              });
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
                    id="eventTimeOption"
                    variant={isSelected.length === 0 ? "outlined" : "solid"}
                    onClick={() => toggleSelection(option)}
                  >
                    {startDate.toDateString()}: {formattedStart}-{formattedEnd}
                  </Button>
                </Tooltip>
              );
            })}
            <Button id="eventTimeAdjustment" onClick={() => setModalOpen(true)}>
              Adjust Time
            </Button>
          </ButtonGroup>
          <CalendarTimeModal
            editMode={true}
            eventInfo={eventOption}
            groupNum={groupNum}
            modalOpen={modalOpen}
            toggleModal={() => setModalOpen((prev) => !prev)}
            singleRecipe={false}
          />
        </Box>
      </CardContent>
    </Card>
  );
};

export default CalendarEventCard;
