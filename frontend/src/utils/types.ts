import type { User } from "firebase/auth";

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

interface RecipeUserAccountInfo {
    firebaseId: string
    email: string
    intolerances: string[]
    diets: string[]
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

interface RecipeRegistrationFormEvents {
    handleRegistrationSubmit?: ({userIntolerances, userDiets}: {userIntolerances: string[], userDiets: string[]}) => void
    handleLoginSubmit?: (event: React.FormEvent) => void
    handleInputChange: (event: React.ChangeEvent<HTMLInputElement>) => void
    formData: RecipeAuthFormData
}

interface AuthFormResultMessage {
    type: string
    text: string
}

interface CurrentUserData {
    user: User
    userEmail: string,
    userIntolerances: string[],
    userDiets: string[]
}

interface AuthFormResultMessage {
    type: string
    text: string
}

export type {RecipeToggleNavBar, RecipeUserAccountInfo, RecipeAuthFormData, RecipeRegistrationFormEvents, CurrentUserData, IngredientData, RecipeData, AuthFormResultMessage}
