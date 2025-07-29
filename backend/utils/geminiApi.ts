import { GoogleGenAI } from "@google/genai";
import { GPAiSubstitutionReturnType } from "../types/aiSubReturnType";
import { GPRecipeIngredientTypes } from "../../frontend/src/utils/types/types";

// The client gets the API key from the environment variable `GEMINI_API_KEY`.
const ai = new GoogleGenAI({});

type GPIngredientSubstituteTypes = {
    ingredient: GPRecipeIngredientTypes
    intolerancesAndDiets: string[]
}

async function getSubstitutionForIngredient({ingredient, intolerancesAndDiets}: GPIngredientSubstituteTypes) {
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: `Give me 3 substitutions for ${ingredient.quantity} ${ingredient.unit} of ${ingredient.ingredientName} for the intolerances and diets ${intolerancesAndDiets}, json formatted as { substitutionTitle: string, substitutionQuantity: number, substitutionUnit: string, storeBought: boolean, substitutionIngredients: [{ingredientName: string, quantity: number, unit: string}], substitutionInstructions: string[] } but if its storebought, then the substitutionIngredients and substitutionInstructions will be empty arrays`,
    config: {
      thinkingConfig: {
        thinkingBudget: 0, // Disables thinking
      },
    }
  });
  const responseText = response.text;
  const prepForJson = responseText?.replace(/`/g, "").replace("json", "") ?? ""
  const asJson: GPAiSubstitutionReturnType[] = JSON.parse(prepForJson)
}

export { getSubstitutionForIngredient }