class TimePreference {
  startTime: string;
  endTime: string;

  constructor(startTime: string, endTime: string) {
    this.startTime = startTime;
    this.endTime = endTime;
  }

  get start() {
    return this.startTime;
  }

  get end() {
    return this.endTime;
  }
}
