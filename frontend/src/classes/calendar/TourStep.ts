class TourStep {
  readonly selectElement: string;
  readonly stepInfo: string;
  readonly relativePosition: string;

  constructor(
    selectElement: string,
    stepInfo: string,
    relativePosition: string
  ) {
    this.selectElement = selectElement;
    this.stepInfo = stepInfo;
    this.relativePosition = relativePosition;
  }

  get element() {
    return this.selectElement;
  }

  get description() {
    return this.stepInfo;
  }

  get position() {
    return this.relativePosition;
  }
}

export { TourStep };
