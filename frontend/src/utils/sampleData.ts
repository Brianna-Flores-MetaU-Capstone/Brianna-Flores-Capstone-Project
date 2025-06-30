import type { RecipeIngredientData } from "./types"

const ingredients: RecipeIngredientData[] = [
    {
        department: "dairy",
        image: "",
        name: "milk",
        amount: "5",
        unit: "cups",
        estimatedCost: 4.00,
        expirationDate: "07/16/2025"
    }, 
    {
        department: "dairy",
        image: "",
        name: "eggs",
        amount: "7",
        unit: "units",
        estimatedCost: 4.00,
        expirationDate: "07/16/2025"
    },
    {
        department: "dairy",
        image: "",
        name: "yogurt",
        amount: "3",
        unit: "containers",
        estimatedCost: 4.00,
        expirationDate: "07/16/2025"
    },
    {
        department: "meat",
        image: "",
        name: "chicken",
        amount: "4",
        unit: "breasts",
        estimatedCost: 4.00,
        expirationDate: "07/16/2025"
    },
    {
        department: "pantry",
        image: "",
        name: "soy sauce",
        amount: "1",
        unit: "cup",
        estimatedCost: 4.00,
        expirationDate: "07/16/2025"
    },
    {
        department: "produce",
        image: "",
        name: "bananas",
        amount: "3",
        unit: "units",
        estimatedCost: 4.00,
        expirationDate: "07/16/2025"
    },
    {
        department: "pantry",
        image: "",
        name: "bread",
        amount: "12",
        unit: "slices",
        estimatedCost: 4.00,
        expirationDate: "07/16/2025"
    },
    {
        department: "dairy",
        image: "",
        name: "cottage cheese",
        amount: "1",
        unit: "cup",
        estimatedCost: 4.00,
        expirationDate: "07/16/2025"
    },
    {
        department: "pantry",
        image: "",
        name: "beans",
        amount: "2",
        unit: "cups",
        estimatedCost: 4.00,
        expirationDate: "07/16/2025"
    },
    {
        department: "deli",
        image: "",
        name: "cheese",
        amount: "12",
        unit: "slices",
        estimatedCost: 4.00,
        expirationDate: "07/16/2025"
    },
    {
        department: "pantry",
        image: "",
        name: "cereal",
        amount: "3",
        unit: "cups",
        estimatedCost: 4.00,
        expirationDate: "07/16/2025"
    },
]


const groceryList: RecipeIngredientData[] = [
    {
        department: "pantry",
        image: "",
        name: "pasta",
        amount: "5",
        unit: "cups",
        estimatedCost: 4.00,
    }, 
    {
        department: "meat",
        image: "",
        name: "ground beef",
        amount: "1",
        unit: "lb",
        estimatedCost: 4.00
    },
    {
        department: "pantry",
        image: "",
        name: "chocolate",
        amount: "1",
        unit: "bag",
        estimatedCost: 4.00
    },
    {
        department: "frozen",
        image: "",
        name: "ice cream",
        amount: "1",
        unit: "tub",
        estimatedCost: 4.00
    },
    {
        department: "produce",
        image: "",
        name: "spinach",
        amount: "5",
        unit: "oz",
        estimatedCost: 4.00
    }
]

export {ingredients, groceryList}