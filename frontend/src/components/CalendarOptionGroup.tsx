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
          aria-label="Accept Event Group Recommendation"
          variant="plain"
          color="success"
          size="lg"
        >
          <CheckCircleOutlineIcon />
        <Typography>Accept All</Typography>
        </IconButton>
      </Box>
      <TitledListView
        itemsList={eventOptions}
        renderItem={(event, index) => (
          <CalendarEventCard key={index} eventOption={event} groupNum={groupNum - 1}/>
        )}
        flexDirectionRow
      />
    </Box>
  );
};

export default CalendarOptionGroup;
