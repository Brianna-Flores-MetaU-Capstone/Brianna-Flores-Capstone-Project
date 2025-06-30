interface RecipeToggleNavBar {
    navOpen: boolean;
    toggleNav: () => void 
}

interface RecipeAuthFormResult {
    type: string
    text: string
}

interface RecipeNewUserFirebaseId {
    firebaseId: string
    email: string
}

interface RecipeAuthFormData {
    email: string
    password: string
}

interface RecipeIngredientData {
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

export type {RecipeToggleNavBar, RecipeAuthFormResult, RecipeNewUserFirebaseId, RecipeAuthFormData, RecipeIngredientData, RecipeAuthFormEvents}