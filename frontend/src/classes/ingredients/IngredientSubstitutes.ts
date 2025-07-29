type GPBasicIngredientInfoType = {
  ingredientName: string;
  quantity: number;
  unit: string;
};
class IngredientSubstitutes {
  readonly substitutionTitle: string;
  readonly substitutionQuantity: number;
  readonly substitutionUnit: string;
  readonly storeBought: boolean;
  readonly substitutionIngredients: GPBasicIngredientInfoType[];
  readonly substitutionInstructions: string[];

  constructor(
    substitutionTitle: string,
    substitutionQuantity: number,
    substitutionUnit: string,
    storeBought: boolean,
    substitutionIngredients: GPBasicIngredientInfoType[],
    substitutionInstructions: string[]
  ) {
    this.substitutionTitle = substitutionTitle;
    this.substitutionQuantity = substitutionQuantity;
    this.substitutionUnit = substitutionUnit;
    this.storeBought = storeBought;
    this.substitutionIngredients = substitutionIngredients;
    this.substitutionInstructions = substitutionInstructions;
  }
}

export { IngredientSubstitutes };
