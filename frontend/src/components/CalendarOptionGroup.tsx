import { Box, Typography, IconButton } from "@mui/joy";
import type { GPRecipeEventOptionType } from "../utils/types";
import CalendarEventCard from "./CalendarEventCard";
import TitledListView from "./TitledListView";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";

type GPCalendarOptionGroup = {
  eventOptions: GPRecipeEventOptionType[];
  groupNum: number;
  adjustedSuggestion: boolean;
};

const CalendarOptionGroup = ({
  eventOptions,
  groupNum,
  adjustedSuggestion,
}: GPCalendarOptionGroup) => {
  return (
    <Box>
      <Box sx={{display: "flex", alignItems: "center", justifyContent: "space-between"}}>
        <Typography>Option Group #{groupNum}</Typography>
        <IconButton
          disabled={adjustedSuggestion}
          aria-label="Accept Event Group Reccomendation"
          variant="plain"
          color="success"
          size="lg"
        >
          <CheckCircleOutlineIcon />
        <Typography>Accept All</Typography>
        </IconButton>
      </Box>
      <TitledListView
        list={eventOptions}
        renderItem={(event) => (
          <CalendarEventCard key={event.recipe.apiId} eventOption={event} groupNum={groupNum - 1}/>
        )}
        flexDirectionRow
      />
    </Box>
  );
};

export default CalendarOptionGroup;
