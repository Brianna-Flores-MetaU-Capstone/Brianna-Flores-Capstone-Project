interface navigationTypes {
    navOpen: boolean;
    toggleNav: () => void 
}

interface messageTypes {
    type: string
    text: string
}

interface newUserType {
    firebaseId: string
    email: string
}

interface formDataType {
    email: string
    password: string
}

interface ingredientType {
    department: string
    image: string
    name: string
    amount: string
    unit: string
    estimatedCost: number
    expirationDate?: string
}

export type {navigationTypes, messageTypes, newUserType, formDataType, ingredientType}