type GPTimePreferenceType = "start" | "end";

class TimePreferenceString {
  start: string;
  end: string;

  constructor(start?: string, end?: string) {
    this.start = start ?? "";
    this.end = end ?? "";
  }

  get startTime() {
    return this.start;
  }

  get endTime() {
    return this.end;
  }

  set setStart(newStart: string) {
    this.start = newStart;
  }

  set setEnd(newEnd: string) {
    this.end = newEnd;
  }

  /**
   * Set a users time preference on input change
   * @param timeField the field to set (start or end)
   * @param newValue the value to set the field to
   */
  setTime(timeField: GPTimePreferenceType, newValue: string) {
    this[timeField] = newValue;
  }
}

export { TimePreferenceString, type GPTimePreferenceType };
