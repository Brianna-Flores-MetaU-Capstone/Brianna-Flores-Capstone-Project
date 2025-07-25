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
];

export { CalendarTimeModalPreferenceTour };
