interface RecipeToggleNavBar {
    navOpen: boolean;
    toggleNav: () => void 
}

interface RecipeData {
    id: number
    image: string
    title: string
    servings: number
    sourceUrl: string
    vegetarian: boolean
    vegan: boolean
    glutenFree: boolean
    dairyFree: boolean
    ingredients: IngredientData[]
    totalEstimatedCost: number
}

interface RecipeNewUserFirebaseId {
    firebaseId: string
    email: string
}

interface RecipeAuthFormData {
    email: string
    password: string
}

interface IngredientData {
    department: string
    image: string
    name: string
    quantity: string
    unit: string
    estimatedCost: number
    expirationDate?: string
}

interface RecipeAuthFormEvents {
    handleSubmit: (event: React.FormEvent) => void
    handleChange: (event: React.ChangeEvent<HTMLInputElement>) => void
    formData: RecipeAuthFormData
}

interface AuthFormResultMessage {
    type: string
    text: string
}

export type {RecipeToggleNavBar, RecipeNewUserFirebaseId, RecipeAuthFormData, IngredientData, RecipeAuthFormEvents, RecipeData, AuthFormResultMessage}