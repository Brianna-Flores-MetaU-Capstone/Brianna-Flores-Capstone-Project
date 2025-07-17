import { useState } from "react";
import type { GPRecipeEventOptionType } from "../utils/types";
import {
  Button,
  Box,
  Card,
  ButtonGroup,
  CardContent,
  Typography,
  AspectRatio,
  Tooltip
} from "@mui/joy";
import { DaysOfWeek } from "../utils/enum";
import CalendarTimeModal from "./CalendarTimeModal";

type GPCalendarOption = {
  eventOption: GPRecipeEventOptionType;
  groupNum: number;
};

const CalendarEventCard = ({ eventOption, groupNum }: GPCalendarOption) => {
  const [modalOpen, setModalOpen] = useState(false);
  const recipe = eventOption.recipe;
  const startDate = new Date(eventOption.timeOptions[0].start);

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
                  }
                );
                return (
                  <Tooltip title="Select time">
                  <Button onClick={() => {}} key={index}>
                    {formattedStart}-{formattedEnd}
                  </Button>
                  </Tooltip>
                );
              })}
              <Button
                onClick={() => setModalOpen(true)}
              >
                Adjust Time
              </Button>
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
