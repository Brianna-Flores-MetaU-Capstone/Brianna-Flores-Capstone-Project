type navigationTypes = {
    navOpen: boolean;
    toggleNav: () => void 
}

interface searchRequestType {
    numToRequest: number
    offset: number
}

interface ingredientType {
    department: string
    image: string
    name: string
    amount: string
    unit: string
    estimatedCost: number
}

interface recipeType {
    id: number
    image: string
    title: string
    servings: number
    sourceUrl: string
    vegetarian: boolean
    vegan: boolean
    glutenFree: boolean
    dairyFree: boolean
    ingredients: ingredientType[]
    totalEstimatedCost: number
}



export type {navigationTypes, searchRequestType, recipeType, ingredientType}