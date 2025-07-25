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

  /**
   * Returns date of event formatted as Day Month Date Year
   * @returns date as string
   */
  getFormattedDate() {
    return this.start.toDateString();
  }

  /**
   * Returns time of event formatted as XX:XX AM/PM - XX:XX AM/PM
   * @returns event time range as string
   */
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
