import { TourStep } from "../../../classes/calendar/TourStep";

const PositionsEnum = {
  TOP: "top",
  RIGHT: "right",
  LEFT: "left",
  BOTTOM: "bottom",
};

const CalendarTimeModalPreferenceTour: TourStep[] = [
  new TourStep(
    "#eventDateInput",
    "Choose what day you would like to begin scheduling on",
    PositionsEnum.RIGHT
  ),
  new TourStep(
    "#eventTimeInput",
    "Choose what times of the day you would prefer to cook at (will suggest events if time block is available), otherwise will default to any other free time in schedule",
    PositionsEnum.RIGHT
  ),
  new TourStep(
    "#eventAddTimeblock",
    "Add multiple preferred time blocks",
    PositionsEnum.RIGHT
  ),
  new TourStep(
    "#cookThroughoutWeekButton",
    "Select if you would like to schedule events for each selected recipe, spaced throughout the week",
    PositionsEnum.RIGHT
  ),
  new TourStep(
    "#cookSingleDayButton",
    "Select if you would like to schedule a single time block to cook/meal prep all recipes at once",
    PositionsEnum.RIGHT
  ),
  new TourStep(
    "#servingsPerDay",
    "Input the expected servings planned to consume per day",
    PositionsEnum.RIGHT
  ),
];

const CalendarRecipesModalTour: TourStep[] = [
  new TourStep(
    "#eventOptionGroup",
    "Multiple arrangements are generated to choose the ordering that sounds best to you!",
    PositionsEnum.RIGHT
  ),
  new TourStep(
    "#eventCard",
    "An event card is created for each selected recipe",
    PositionsEnum.RIGHT
  ),
  new TourStep(
    "#eventTimeOption",
    "Times are suggested based on the requested preferred time and free space in your schedule!",
    PositionsEnum.RIGHT
  ),
  new TourStep(
    "#eventTimeAdjustment",
    "Click to adjust the date and time of the suggested events",
    PositionsEnum.RIGHT
  ),
  new TourStep(
    "#confirmSelections",
    "After making selections, confirm to add to google calendar!",
    PositionsEnum.TOP
  ),
];

const CalendarTimeModalAdjustTour: TourStep[] = [
  new TourStep(
    "#eventDateInput",
    "Adjust the date that the event is scheduled for",
    PositionsEnum.RIGHT
  ),
  new TourStep(
    "#eventTimeInput",
    "Adjust the time the event is scheduled for",
    PositionsEnum.RIGHT
  ),
];

export {
  PositionsEnum,
  CalendarTimeModalPreferenceTour,
  CalendarRecipesModalTour,
  CalendarTimeModalAdjustTour,
};
