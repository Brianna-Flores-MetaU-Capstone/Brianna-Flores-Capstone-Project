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



type messageTypes = {
    type: string
    text: string
}

type newUserType = {
    firebaseId: string
    email: string
}

type formData = {
    username: string
    password: string
}

export type {navigationTypes, searchRequestType, recipeType, ingredientType, messageTypes, newUserType, formData}