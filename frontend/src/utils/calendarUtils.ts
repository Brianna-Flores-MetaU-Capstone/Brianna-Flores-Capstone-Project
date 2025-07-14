// Parse user events to extract only necessary data
const parseUserEvents = (userEventsData: any) => {
  return userEventsData.map((userEvent: any) => ({
    event: userEvent.summary,
    start: new Date(userEvent.start.dateTime),
    end: new Date(userEvent.end.dateTime),
  }));
};

import type { GPUserEventTypes } from "./types";

type GPFreeSpaceTypes = {
  userEvents: GPUserEventTypes[];
  startDate: Date;
  endDate: Date;
  REQUESTED_DAYS: number;
};

const findFreeTime = ({
  userEvents,
  startDate,
  endDate,
}: GPFreeSpaceTypes) => {
  // create array of available free spaces in a users week
  let freeSpaces: GPUserEventTypes[] = [];
  let timePointer = startDate;
  // loop through events in calendar starting pointer at start date
  for (const event of userEvents) {
    if (timePointer.getTime() < event.start.getTime()) {
      // create an event object to mark the free space
      const newFreeSpace = {
        name: "free",
        start: new Date(timePointer.getTime()),
        end: new Date(event.start.getTime()),
      };
      freeSpaces = [...freeSpaces, newFreeSpace];
      // move time pointer to the end of the event
      timePointer = event.end;
    }
  }
  // after last event in list is checked, check to see if there is space between the time pointer to end
  if (timePointer.getTime() < endDate.getTime()) {
    const newFreeSpace = {
      name: "free",
      start: new Date(timePointer.getTime()),
      end: new Date(endDate.getTime()),
    };
    freeSpaces = [...freeSpaces, newFreeSpace];
  }
  return freeSpaces;
};

// remove free space between certain hours of the day
const parseFreeTime = (freeSpace: GPUserEventTypes[]) => {
    // loop through the array of free space

}

export { parseUserEvents, findFreeTime, parseFreeTime };
