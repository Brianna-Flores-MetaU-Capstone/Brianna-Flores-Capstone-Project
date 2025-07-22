class CalendarEvent {
  readonly eventTitle: string;
  readonly start: string;
  readonly end: string;
  readonly eventLink: string;

  constructor(
    eventTitle: string,
    start: string,
    end: string,
    eventLink: string
  ) {
    this.eventTitle = eventTitle;
    this.start = start;
    this.end = end;
    this.eventLink = eventLink;
  }
}

export { CalendarEvent };
