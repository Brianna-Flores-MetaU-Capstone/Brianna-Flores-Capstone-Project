declare module "convert-units" {
  interface Converter {
    from(unit: string): Converter;
    to(unit: string): number;
  }
  function convert(value: number): Converter;
  export = convert;
}
