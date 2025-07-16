import type { GPRecipeEventOptionType } from "../utils/types";
import {
  Box,
  Card,
  IconButton,
  CardContent,
  Typography,
  AspectRatio,
} from "@mui/joy";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import { DaysOfWeek } from "../utils/enum";
import AdjustEventTimeModal from "./AdjustEventTimeModal";

type GPCalendarOption = {
  eventOption: GPRecipeEventOptionType;
  groupNum: number
};

const CalendarEventOption = ({
  eventOption,
  groupNum
}: GPCalendarOption) => {
  const recipe = eventOption.recipe;
  const startDate = new Date(eventOption.start);
  const formattedStart = startDate
    .toLocaleTimeString([], { hour: "numeric", minute: "numeric" })
    .replace("PM", "")
    .replace("AM", "");
  const endDate = new Date(eventOption.end);
  const formattedEnd = endDate.toLocaleTimeString([], {
    hour: "numeric",
    minute: "numeric",
  });

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
            <Typography sx={{ fontSize: "lg", fontWeight: "lg" }}>
              {formattedStart}- {formattedEnd}
            </Typography>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <AdjustEventTimeModal
              eventInfo={eventOption}
              groupNum={groupNum}
            />
            <IconButton
              aria-label="Accept Event Reccomendation"
              variant="plain"
              color="success"
              size="md"
            >
              <CheckCircleOutlineIcon />
            </IconButton>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default CalendarEventOption;
