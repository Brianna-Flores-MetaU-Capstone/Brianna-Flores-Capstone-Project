type GPAiSubstitutionReturnType = {
  substitutionTitle: string;
  substitutionQuantity: number;
  substitutionUnit: string;
  substitutionDepartment: string;
  storeBought: boolean;
  substitutionIngredients: [
    {
      ingredientName: string;
      quantity: number;
      unit: string;
      department: string;
    },
  ];
  substitutionInstructions: string[];
};

export type { GPAiSubstitutionReturnType };
