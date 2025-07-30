import type { IngredientSubstitutes } from "../frontend/src/classes/ingredients/IngredientSubstitutes";
import { GPAiSubstitutionReturnType } from "../frontend/src/utils/types/aiSubReturnType";

class IngredientData {
  readonly id: number;
  readonly ingredientName: string;
  quantity: number;
  unit: string;
  readonly department: string;
  isChecked: boolean;
  expirationDate: string | null;
  readonly subIngredients: IngredientData[];
  ingredientCost: number;
  ingredientCostUnit: string;
  ingredientSubstitutes: GPAiSubstitutionReturnType[];
  ingredientWalmartId: number;

  constructor(
    id: number,
    ingredientName: string,
    quantity: number,
    unit: string,
    department: string,
    isChecked: boolean,
    expirationDate?: string | null,
    subIngredients?: IngredientData[],
    ingredientCost?: number,
    ingredientCostUnit?: string,
    ingredientSubstitutes?: GPAiSubstitutionReturnType[],
    ingredientWalmartId?: number
  ) {
    this.id = id;
    this.ingredientName = ingredientName;
    this.quantity = quantity;
    this.unit = unit;
    this.department = department;
    this.isChecked = isChecked;
    this.expirationDate = expirationDate ?? null;
    this.subIngredients = subIngredients ?? [];
    this.ingredientCost = ingredientCost ?? 0;
    this.ingredientCostUnit = ingredientCostUnit ?? "";
    this.ingredientSubstitutes = ingredientSubstitutes ?? [];
    this.ingredientWalmartId = ingredientWalmartId ?? -1
  }
}

export { IngredientData };
