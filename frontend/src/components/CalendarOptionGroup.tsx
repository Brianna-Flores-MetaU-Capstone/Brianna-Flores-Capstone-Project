import { Box, Typography, IconButton } from "@mui/joy";
import type { GPRecipeEventOptionType } from "../utils/types";
import CalendarEventOption from "./CalendarEventOption";
import TitledListView from "./TitledListView";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";

type GPCalendarOptionGroup = {
  eventOptions: GPRecipeEventOptionType[];
  groupNum: number;
};

const CalendarOptionGroup = ({
  eventOptions,
  groupNum,
}: GPCalendarOptionGroup) => {
  return (
    <Box>
      <Box sx={{display: "flex", alignItems: "center", justifyContent: "space-between"}}>
        <Typography>Option Group #{groupNum}</Typography>
        <IconButton
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
          <CalendarEventOption key={event.recipe.apiId} eventOption={event} />
        )}
        flexDirectionRow
      />
    </Box>
  );
};

export default CalendarOptionGroup;
