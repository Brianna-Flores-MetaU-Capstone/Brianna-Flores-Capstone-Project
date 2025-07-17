class TimeBlock {
  start: Date;
  end: Date;

  constructor(start: Date, end: Date) {
    this.start = new Date(start);
    this.end = new Date(end);
  }

  get getStart() {
    return this.start;
  }
  get getEnd() {
    return this.end;
  }

  get getDurationMilliseconds() {
    return this.end.getTime() - this.start.getTime();
  }

  get getDurationSeconds() {
    return (this.end.getTime() - this.start.getTime()) / 1000;
  }

  get getDurationMinutes() {
    return (this.end.getTime() - this.start.getTime()) / (60 * 1000);
  }

  set setStart(value: number) {
    this.start.setTime(value);
  }

  set setEnd(value: number) {
    this.end.setTime(value);
  }

  toString() {
    const formattedStart = this.start
      .toLocaleTimeString([], {
        hour: "numeric",
        minute: "numeric",
      })
      .replace(" PM", "")
      .replace(" AM", "");
    const formattedEnd = this.end.toLocaleTimeString([], {
      hour: "numeric",
      minute: "numeric",
    });
    return `${formattedStart}-${formattedEnd}`;
  }
}

export default TimeBlock;
