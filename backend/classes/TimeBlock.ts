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

  getOverlap(freeTimeBlock: TimeBlock) {
    const preferredStart = this.start.getTime();
    const preferredEnd = this.end.getTime();
    const freeBlockStart = freeTimeBlock.start.getTime();
    const freeBlockEnd = freeTimeBlock.end.getTime();

    if (freeBlockStart > preferredEnd || freeBlockEnd < preferredStart) {
      // no overlap
      return { start: 0, end: 0 };
    }
    let start = 0;
    let end = 0;
    if (freeBlockStart <= preferredStart && freeBlockEnd >= preferredEnd) {
      // preferred block completely within free block
      start = preferredStart;
      end = preferredEnd;
    }
    if (preferredStart <= freeBlockStart && preferredEnd >= freeBlockEnd) {
      // free block is completely within preferred block
      start = freeBlockStart;
      end = freeBlockEnd;
    }
    if (
      freeBlockStart < preferredStart &&
      freeBlockEnd > preferredStart &&
      freeBlockEnd < preferredEnd
    ) {
      // free block starts before preferred block and ends within preferred block
      start = preferredStart;
      end = freeBlockEnd;
    }
    if (
      freeBlockStart > preferredStart &&
      freeBlockStart < preferredEnd &&
      freeBlockEnd > preferredEnd
    ) {
      // free block starts within preferred block and ends after it
      start = freeBlockStart;
      end = preferredEnd;
    }
    return { start: start, end: end };
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
