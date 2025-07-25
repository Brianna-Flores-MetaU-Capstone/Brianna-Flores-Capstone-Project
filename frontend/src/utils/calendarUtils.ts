import type { GPCalendarJSONType } from "./calendarApiTypes";

// Parse user events to extract only necessary data
const parseUserEvents = (userEventsData: GPCalendarJSONType[]) => {
  return userEventsData.map((userEvent: GPCalendarJSONType) => ({
    name: userEvent.summary,
    start: new Date(userEvent.start.dateTime),
    end: new Date(userEvent.end.dateTime),
  }));
};

import type { GPUserEventTypes } from "./types";
import { START_OF_DAY_TIME, END_OF_DAY_TIME } from "./constants";

type GPFreeSpaceTypes = {
  userEvents: GPUserEventTypes[];
  startDate: Date;
  endDate: Date;
  REQUESTED_DAYS: number;
};

const findFreeTime = ({ userEvents, startDate, endDate }: GPFreeSpaceTypes) => {
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
const parseFreeTime = (userFreeSpace: GPUserEventTypes[]) => {
  let parsedFreeTime: GPUserEventTypes[] = [];
  // loop through the array of free space
  for (const freeSpace of userFreeSpace) {
    let freeSpaceStart = freeSpace.start;
    let freeSpaceEnd = freeSpace.end;
    // if start and end days are not the same, split event
    while (freeSpaceStart < freeSpaceEnd) {
      // while loop if free space spans multiple days
      const startOfDay = new Date(freeSpaceStart);
      const endOfDay = new Date(freeSpaceStart);
      startOfDay.setHours(START_OF_DAY_TIME, 0, 0, 0);
      endOfDay.setHours(END_OF_DAY_TIME, 0, 0, 0); // set end date to end of day
      const newStart =
        freeSpaceStart > startOfDay
          ? new Date(freeSpaceStart)
          : new Date(startOfDay);
      const newEnd =
        freeSpaceEnd > endOfDay ? new Date(endOfDay) : new Date(freeSpaceEnd);
      if (newEnd > newStart) {
        const splitFreeStart = {
          name: "free",
          start: newStart,
          end: newEnd,
        };
        parsedFreeTime = [...parsedFreeTime, splitFreeStart];
      }
      freeSpaceStart.setDate(freeSpaceStart.getDate() + 1);
      freeSpaceStart.setHours(START_OF_DAY_TIME, 0, 0, 0);
    }
  }
  return parsedFreeTime;
};

export { parseUserEvents, findFreeTime, parseFreeTime };
