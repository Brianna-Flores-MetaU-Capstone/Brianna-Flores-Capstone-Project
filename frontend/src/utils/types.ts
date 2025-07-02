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
    intollerances: string[]
    diets: string[]
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

// interface RecipeAuthFormEvents {
interface RecipeRegistrationFormEvents {
    // handleSubmit: (event: React.FormEvent) => void
    handleSubmit: ({userIntollerances, userDiets}: {userIntollerances: string[], userDiets: string[]}) => void
    handleChange: (event: React.ChangeEvent<HTMLInputElement>) => void
    formData: RecipeAuthFormData
}

interface RecipeLoginFormEvents {
    handleSubmit: (event: React.FormEvent) => void
    // handleSubmit: ({userIntollerances, userDiets}: {userIntollerances: string[], userDiets: string[]}) => void
    handleChange: (event: React.ChangeEvent<HTMLInputElement>) => void
    formData: RecipeAuthFormData
}

// export type {RecipeToggleNavBar, RecipeAuthFormResult, RecipeNewUserFirebaseId, RecipeAuthFormData, RecipeIngredientData, RecipeAuthFormEvents}
export type {RecipeToggleNavBar, RecipeAuthFormResult, RecipeNewUserFirebaseId, RecipeAuthFormData, RecipeIngredientData, RecipeRegistrationFormEvents, RecipeLoginFormEvents}