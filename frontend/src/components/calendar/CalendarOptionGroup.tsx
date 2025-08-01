import { Box, Typography } from "@mui/joy";
import type { GPRecipeEventOptionType } from "../../utils/types/types";
import CalendarEventCard from "./CalendarEventCard";
import TitledListView from "../utils/TitledListView";
import { CenteredTitledListStyle } from "../../utils/style/UIStyle";

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
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Typography id="eventOptionGroup">Option #{groupNum}</Typography>
      </Box>
      <TitledListView
        itemsList={eventOptions}
        renderItem={(event, index) => (
          <CalendarEventCard
            key={index}
            eventOption={event}
            groupNum={groupNum - 1}
          />
        )}
        listItemsStyle={CenteredTitledListStyle}
      />
    </Box>
  );
};

export default CalendarOptionGroup;
