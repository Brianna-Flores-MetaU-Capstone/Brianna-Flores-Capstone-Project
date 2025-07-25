import { TourStep } from "../../classes/calendar/TourStep";

const PositionsEnum = {
  TOP: "top",
  RIGHT: "right",
  LEFT: "left",
  BOTTOM: "bottom",
};

const CalendarTimeModalPreferenceTour: TourStep[] = [
  new TourStep(
    "#eventDateInput",
    "Choose the day you'd like to begin scheduling meals",
    PositionsEnum.RIGHT,
  ),
  new TourStep(
    "#eventTimeInput",
    "Add times of day you'd prefer to cook, the system will prioritize these preferences if available in calendar",
    PositionsEnum.RIGHT,
  ),
  new TourStep(
    "#eventAddTimeblock",
    "You can add several preferred time blocks throughout the day",
    PositionsEnum.RIGHT,
  ),
  new TourStep(
    "#eventSchedulingMode",
    "Decide how you'd like the events to be spread out",
    PositionsEnum.TOP,
  ),
  new TourStep(
    "#cookThroughoutWeekButton",
    "Select if you'd like the system to schedule cooking events across the week based on your recipe list",
    PositionsEnum.RIGHT,
  ),
  new TourStep(
    "#cookSingleDayButton",
    "Select if you'd like to schedule a single time block to prep all recipes at once",
    PositionsEnum.RIGHT,
  ),
  new TourStep(
    "#servingsPerDay",
    "Enter how many servings you plan to eat per day to help the system determine a schedule and account for leftovers",
    PositionsEnum.RIGHT,
  ),
];

const CalendarTimeModalSinglePreferenceTour = [
  new TourStep(
    "#eventDateInput",
    "Choose the day you'd like schedule to cook this recipe",
    PositionsEnum.RIGHT,
  ),
  new TourStep(
    "#eventTimeInput",
    "Add times of day you'd prefer to cook, the system will prioritize these preferences if available in calendar",
    PositionsEnum.RIGHT,
  ),
  new TourStep(
    "#eventAddTimeblock",
    "You can add several preferred time blocks throughout the day",
    PositionsEnum.RIGHT,
  ),
];

const CalendarRecipesModalTour: TourStep[] = [
  new TourStep(
    "#eventOptionGroup",
    "Multiple arrangements are generated based on your availability and preferences, pick what works best for you!",
    PositionsEnum.RIGHT,
  ),
  new TourStep(
    "#eventCard",
    "Each scheduled recipe is displayed as an event card displaying details",
    PositionsEnum.RIGHT,
  ),
  new TourStep(
    "#eventTimeOption",
    "Times slots are suggested based on your preferences and open space in your schedule!",
    PositionsEnum.RIGHT,
  ),
  new TourStep(
    "#eventTimeAdjustment",
    "Want to tweak the time? Click to adjust the date or time of any suggested event!",
    PositionsEnum.RIGHT,
  ),
  new TourStep(
    "#confirmSelections",
    "When you're happy with your selections, click to add the events to your Google Calendar!",
    PositionsEnum.TOP,
  ),
];

const CalendarTimeModalAdjustTour: TourStep[] = [
  new TourStep(
    "#eventDateInput",
    "Adjust the date of the scheduled cooking event",
    PositionsEnum.RIGHT,
  ),
  new TourStep(
    "#eventTimeInput",
    "Adjust the time of the scheduled cooking event",
    PositionsEnum.RIGHT,
  ),
];

export {
  PositionsEnum,
  CalendarTimeModalPreferenceTour,
  CalendarTimeModalSinglePreferenceTour,
  CalendarRecipesModalTour,
  CalendarTimeModalAdjustTour,
};
