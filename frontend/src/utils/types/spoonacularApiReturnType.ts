type GPSpoonacularReturnType = {
  results: GPSpoonacularResultsType[];
  offset: number;
  number: number;
  totalResults: number;
};

type GPSpoonacularResultsType = {
  id: number;
  image: string;
  imageType: string;
  title: string;
  readyInMinutes: number;
  servings: number;
  sourceUrl: string;
  vegetarian: boolean;
  vegan: boolean;
  glutenFree: boolean;
  dairyFree: boolean;
  veryHealthy: boolean;
  cheap: boolean;
  veryPopular: boolean;
  sustainable: boolean;
  lowFodmap: boolean;
  weightWatcherSmartPoints: number;
  gaps: string;
  preparationMinutes: number | null;
  cookingMinutes: number | null;
  aggregateLikes: number;
  healthScore: number;
  creditsText: string;
  license: string | null;
  sourceName: string;
  pricePerServing: number;
  extendedIngredients: [
    {
      id: number;
      aisle: string;
      image: string;
      consistency: string;
      name: string;
      nameClean: string;
      original: string;
      originalName: string;
      amount: number;
      unit: string;
      meta: string[];
      measures: {
        us: {
          amount: number;
          unitShort: string;
          unitLong: string;
        };
        metric: {
          amount: number;
          unitShort: string;
          unitLong: string;
        };
      };
    },
  ];
  summary: string;
  cuisines: string[];
  dishTypes: string[];
  diets: string[];
  occasions: string[];
  analyzedInstructions: [
    {
      name: string;
      steps: [
        {
          number: number;
          step: string;
          ingredients: [
            {
              id: number;
              name: string;
              localizedName: string;
              image: string;
            },
          ];
          equipment: string[];
          length: {
            number: number;
            unit: string;
          };
        },
      ];
    },
  ];
  spoonacularScore: number;
  spoonacularSourceUrl: string;
  usedIngredientCount: number;
  missedIngredientCount: number;
  missedIngredients: [
    {
      id: number;
      amount: number;
      unit: string;
      unitLong: string;
      unitShort: string;
      aisle: string;
      name: string;
      original: string;
      originalName: string;
      meta: string[];
      image: string;
    },
  ];
  likes: number;
  usedIngredients: string[];
  unusedIngredients: string[];
};

export type { GPSpoonacularReturnType, GPSpoonacularResultsType };
