class IngredientData {
 readonly id: number;
 readonly ingredientName: string;
 quantity: number;
 unit: string;
 readonly department: string;
 isChecked: boolean;
 expirationDate?: string | null;
 ingredientCost?: number;
 ingredientCostUnit?: string;


 constructor(
   id: number,
   ingredientName: string,
   quantity: number,
   unit: string,
   department: string,
   isChecked: boolean,
   expirationDate?: string | null,
   ingredientCost?: number,
   ingredientCostUnit?: string
 ) {
   this.id = id;
   this.ingredientName = ingredientName;
   this.quantity = quantity;
   this.unit = unit;
   this.department = department;
   this.isChecked = isChecked;
   this.expirationDate = expirationDate ?? null;
   this.ingredientCost = ingredientCost ?? 0;
   this.ingredientCostUnit = ingredientCostUnit ?? "";
 }
}


export { IngredientData };