import type { GPCalendarJSONType } from "./calendarApiTypes";

type GPCalendarEventsListType = {
  kind: "calendar#events";
  etag: string;
  summary: string;
  description: string;
  updated: Date;
  timeZone: string;
  accessRole: string;
  defaultReminders: [
    {
      method: string;
      minutes: number;
    },
  ];
  nextPageToken: string;
  nextSyncToken: string;
  items: GPCalendarJSONType[];
};

export type { GPCalendarEventsListType };
