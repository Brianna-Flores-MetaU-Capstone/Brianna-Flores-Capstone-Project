type GPAiSubstitutionReturnType = {
  substitutionTitle: string,
  substitutionQuantity: number,
  substitutionUnit: string,
  storeBought: boolean,
  substitutionIngredients: [
    {
      ingredientName: string,
      quantity: number,
      unit: string,
    },
  ];
  substitutionInstructions: string[]
};

export type { GPAiSubstitutionReturnType };
