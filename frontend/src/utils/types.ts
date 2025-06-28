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

interface formData {
    username: string
    password: string
}

interface ingredientType {
    department: string
    image: string
    name: string
    amount: string
    unit: string
    estimatedCost: number
}

export type {navigationTypes, messageTypes, newUserType, formData, ingredientType}