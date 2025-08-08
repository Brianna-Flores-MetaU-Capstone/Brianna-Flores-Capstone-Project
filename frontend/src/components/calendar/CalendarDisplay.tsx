import { Box, Grid, Typography } from "@mui/joy";
import { DaysOfWeek } from "../../utils/enum";
import MealCard from "../recipeDisplay/MealCard";
import type { Recipe } from "../../../../shared/Recipe";
import { useState } from "react";
import type { GPErrorMessageTypes } from "../../utils/types/types";

type GPUpcomingScheduleType = {
  selectedRecipes: Recipe[];
};

const CalendarDisplay = ({ selectedRecipes }: GPUpcomingScheduleType) => {
  const startAsDate = new Date();
  const startDay = startAsDate.getDay();
  const scheduledRecipes = selectedRecipes.filter(
    (recipe) => recipe.calendarEvents.length !== 0,
  );
  const [_, setMessage] = useState<GPErrorMessageTypes>();
  return (
    <Box sx={{ m: 3 }}>
      <Typography level="h2" sx={{ textAlign: "center", pb: 2 }}>
        Looking at the week ahead
      </Typography>
      <Grid container gap={1} justifyContent={"center"}>
        {new Array(7).fill("").map((_, index) => {
          const currentDay = DaysOfWeek[(startDay + index) % 7];
          const currentDayStart = new Date(startAsDate);
          currentDayStart.setDate(startAsDate.getDate() + index);
          return (
            <Grid key={index} xs={1.64}>
              <Typography
                level="h4"
                sx={{
                  p: 2,
                  my: 1,
                  bgcolor: "primary.300",
                  borderRadius: "md",
                }}
              >
                {currentDay} {currentDayStart.getMonth() + 1}/
                {currentDayStart.getDate()}
              </Typography>
              {scheduledRecipes
                .filter((eventInfo) => {
                  return (
                    eventInfo.calendarEvents[0].start.getDate() ===
                    currentDayStart.getDate()
                  );
                })
                .map((eventInfo, index) => {
                  return (
                    <Box
                      key={index}
                      sx={{ display: "flex", flexGrow: 1, my: 2 }}
                    >
                      <MealCard
                        index={index}
                        toggleCalendarTimeModal={() => {}}
                        parsedMealData={eventInfo}
                        selectedToCompare={false}
                        favorited={false}
                        setMessage={setMessage}
                      />
                    </Box>
                  );
                })}
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
};

export default CalendarDisplay;
