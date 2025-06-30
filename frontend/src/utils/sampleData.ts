import type { RecipeIngredientData } from "./types"

const ingredients: RecipeIngredientData[] = [
    {
        department: "dairy",
        image: "",
        name: "milk",
        quantity: "5",
        unit: "cups",
        estimatedCost: 4.00,
        expirationDate: "2025-07-24"
    }, 
    {
        department: "dairy",
        image: "",
        name: "eggs",
        quantity: "7",
        unit: "units",
        estimatedCost: 4.00,
        expirationDate: "2025-07-24"
    },
    {
        department: "dairy",
        image: "",
        name: "yogurt",
        quantity: "3",
        unit: "containers",
        estimatedCost: 4.00,
        expirationDate: "2025-07-24"
    },
    {
        department: "meat",
        image: "",
        name: "chicken",
        quantity: "4",
        unit: "breasts",
        estimatedCost: 4.00,
        expirationDate: "2025-07-24"
    },
    {
        department: "pantry",
        image: "",
        name: "soy sauce",
        quantity: "1",
        unit: "cup",
        estimatedCost: 4.00,
        expirationDate: "2025-07-24"
    },
    {
        department: "produce",
        image: "",
        name: "bananas",
        quantity: "3",
        unit: "units",
        estimatedCost: 4.00,
        expirationDate: "2025-07-24"
    },
    {
        department: "pantry",
        image: "",
        name: "bread",
        quantity: "12",
        unit: "slices",
        estimatedCost: 4.00,
        expirationDate: "2025-07-24"
    },
    {
        department: "dairy",
        image: "",
        name: "cottage cheese",
        quantity: "1",
        unit: "cup",
        estimatedCost: 4.00,
        expirationDate: "2025-07-24"
    },
    {
        department: "pantry",
        image: "",
        name: "beans",
        quantity: "2",
        unit: "cups",
        estimatedCost: 4.00,
        expirationDate: "2025-07-24"
    },
    {
        department: "deli",
        image: "",
        name: "cheese",
        quantity: "12",
        unit: "slices",
        estimatedCost: 4.00,
        expirationDate: "2025-07-24"
    },
    {
        department: "pantry",
        image: "",
        name: "cereal",
        quantity: "3",
        unit: "cups",
        estimatedCost: 4.00,
        expirationDate: "2025-07-24"
    },
]


const groceryList: RecipeIngredientData[] = [
    {
        department: "pantry",
        image: "",
        name: "pasta",
        quantity: "5",
        unit: "cups",
        estimatedCost: 4.00,
    }, 
    {
        department: "meat",
        image: "",
        name: "ground beef",
        quantity: "1",
        unit: "lb",
        estimatedCost: 4.00
    },
    {
        department: "pantry",
        image: "",
        name: "chocolate",
        quantity: "1",
        unit: "bag",
        estimatedCost: 4.00
    },
    {
        department: "frozen",
        image: "",
        name: "ice cream",
        quantity: "1",
        unit: "tub",
        estimatedCost: 4.00
    },
    {
        department: "produce",
        image: "",
        name: "spinach",
        quantity: "5",
        unit: "oz",
        estimatedCost: 4.00
    }
]

export {ingredients, groceryList}