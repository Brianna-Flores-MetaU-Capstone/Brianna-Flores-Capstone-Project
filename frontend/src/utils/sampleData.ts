import type { IngredientData } from "./types"

// sample data, will only display departments user needs ingredients from
// add/remove departments from list dependent on ingredients user needs
const departments: string[] = [
    "Pasta and Rice",
    "Meat",
    "Sweet Snacks",
    "Frozen",
    "Produce",
    "Milk, Eggs, Other Dairy"
]

const ingredients: IngredientData[] = [
    {
        department: "Milk, Eggs, Other Dairy",
        image: "",
        name: "milk",
        quantity: "5",
        unit: "cups",
        estimatedCost: 4.00,
        expirationDate: "2025-07-24"
    }, 
    {
        department: "Milk, Eggs, Other Dairy",
        image: "",
        name: "eggs",
        quantity: "7",
        unit: "units",
        estimatedCost: 4.00,
        expirationDate: "2025-07-24"
    },
    {
        department: "Milk, Eggs, Other Dairy",
        image: "",
        name: "yogurt",
        quantity: "3",
        unit: "containers",
        estimatedCost: 4.00,
        expirationDate: "2025-07-24"
    },
    {
        department: "Meat",
        image: "",
        name: "chicken",
        quantity: "4",
        unit: "breasts",
        estimatedCost: 4.00,
        expirationDate: "2025-07-24"
    },
    {
        department: "Condiments",
        image: "",
        name: "soy sauce",
        quantity: "1",
        unit: "cup",
        estimatedCost: 4.00,
        expirationDate: "2025-07-24"
    },
    {
        department: "Produce",
        image: "",
        name: "bananas",
        quantity: "3",
        unit: "units",
        estimatedCost: 4.00,
        expirationDate: "2025-07-24"
    },
    {
        department: "Bakery/Bread",
        image: "",
        name: "bread",
        quantity: "12",
        unit: "slices",
        estimatedCost: 4.00,
        expirationDate: "2025-07-24"
    },
    {
        department: "Milk, Eggs, Other Dairy",
        image: "",
        name: "cottage cheese",
        quantity: "1",
        unit: "cup",
        estimatedCost: 4.00,
        expirationDate: "2025-07-24"
    },
    {
        department: "Canned and Jarred",
        image: "",
        name: "beans",
        quantity: "2",
        unit: "cups",
        estimatedCost: 4.00,
        expirationDate: "2025-07-24"
    },
    {
        department: "Cheese",
        image: "",
        name: "cheese",
        quantity: "12",
        unit: "slices",
        estimatedCost: 4.00,
        expirationDate: "2025-07-24"
    },
    {
        department: "Cereal",
        image: "",
        name: "cereal",
        quantity: "3",
        unit: "cups",
        estimatedCost: 4.00,
        expirationDate: "2025-07-24"
    },
]


const groceryList: IngredientData[] = [
    {
        department: "Pasta and Rice",
        image: "",
        name: "pasta",
        quantity: "5",
        unit: "cups",
        estimatedCost: 4.00,
    }, 
    {
        department: "Meat",
        image: "",
        name: "ground beef",
        quantity: "1",
        unit: "lb",
        estimatedCost: 4.00
    },
    {
        department: "Sweet Snacks",
        image: "",
        name: "chocolate",
        quantity: "1",
        unit: "bag",
        estimatedCost: 4.00
    },
    {
        department: "Frozen",
        image: "",
        name: "ice cream",
        quantity: "1",
        unit: "tub",
        estimatedCost: 4.00
    },
    {
        department: "Produce",
        image: "",
        name: "spinach",
        quantity: "5",
        unit: "oz",
        estimatedCost: 4.00
    },
    {
        department: "Milk, Eggs, Other Dairy",
        image: "",
        name: "milk",
        quantity: "5",
        unit: "cups",
        estimatedCost: 4.00,
    }, 
    {
        department: "Produce",
        image: "",
        name: "bananas",
        quantity: "3",
        unit: "units",
        estimatedCost: 4.00,
    },
]

export {ingredients, groceryList, departments}