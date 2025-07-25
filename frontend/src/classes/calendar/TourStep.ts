class TourStep {
  readonly selectElement: string;
  readonly stepInfo: string;

  constructor(selectElement: string, stepInfo: string) {
    this.selectElement = selectElement;
    this.stepInfo = stepInfo;
  }

  get element() {
    return this.selectElement;
  }

  get description() {
    return this.stepInfo;
  }
}

export { TourStep };
