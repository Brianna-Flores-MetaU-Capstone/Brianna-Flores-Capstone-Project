class CalendarEvent {
  readonly eventTitle: string;
  readonly start: Date;
  readonly end: Date;
  readonly eventLink: string;

  constructor(
    eventTitle: string,
    start: string,
    end: string,
    eventLink: string,
  ) {
    this.eventTitle = eventTitle;
    this.start = new Date(start);
    this.end = new Date(end);
    this.eventLink = eventLink;
  }

  getFormattedDate() {
    return this.start.toDateString();
  }

  getFormattedTime() {
    return (
      this.start.toLocaleTimeString([], {
        hour: "numeric",
        minute: "numeric",
      }) +
      "-" +
      this.end.toLocaleTimeString([], {
        hour: "numeric",
        minute: "numeric",
      })
    );
  }
}

export { CalendarEvent };
