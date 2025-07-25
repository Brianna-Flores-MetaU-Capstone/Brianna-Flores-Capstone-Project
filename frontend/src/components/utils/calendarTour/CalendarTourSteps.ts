import { TourStep } from "../../../classes/calendar/TourStep";

const CalendarTimeModalPreferenceTour: TourStep[] = [
  new TourStep(
    "#eventDateInput",
    "Choose what day you would like to begin scheduling on"
  ),
  new TourStep(
    "#eventTimeInput",
    "Choose what times of the day you would prefer to cook at (will suggest events if time block is available), otherwise will default to any other free time in schedule"
  ),
  new TourStep("#eventAddTimeblock", "Add multiple preferred time blocks"),
  new TourStep(
    "#cookThroughoutWeekButton",
    "Select if you would like to schedule events for each selected recipe, spaced throughout the week"
  ),
  new TourStep(
    "#cookSingleDayButton",
    "Select if you would like to schedule a single time block to cook/meal prep all recipes at once"
  ),
  new TourStep(
    "#servingsPerDay",
    "Input the expected servings planned to consume per day"
  ),
];

const CalendarRecipesModalTour: TourStep[] = [
  new TourStep(
    "#eventCard",
    "Multiple arrangements are generated to choose the ordering that sounds best to you!"
  ),
  new TourStep(
    "#eventTimeOption",
    "Events are suggested based on the requested preferred time and free space in your schedule!"
  ),
  new TourStep(
    "#eventTimeAdjustment",
    "Click to adjust the date and time of the suggested events"
  ),
  new TourStep(
    "#confirmSelections",
    "After making selections, confirm to add to google calendar!"
  ),
];

const CalendarTimeModalAdjustTour: TourStep[] = [
  new TourStep(
    "#eventDateInput",
    "Adjust the date that the event is scheduled for"
  ),
  new TourStep("#eventTimeInput", "Adjust the time the event is scheduled for"),
];

export {
  CalendarTimeModalPreferenceTour,
  CalendarRecipesModalTour,
  CalendarTimeModalAdjustTour,
};
