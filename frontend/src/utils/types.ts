import type { User } from "firebase/auth";

interface RecipeToggleNavBar {
    navOpen: boolean;
    toggleNav: () => void 
}

interface RecipeAuthFormResult {
    type: string
    text: string
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
    handleSubmit: ({userIntolerances, userDiets}: {userIntolerances: string[], userDiets: string[]}) => void
    handleChange: (event: React.ChangeEvent<HTMLInputElement>) => void
    formData: RecipeAuthFormData
}

interface RecipeLoginFormEvents {
    handleSubmit: (event: React.FormEvent) => void
    // handleSubmit: ({userIntolerances, userDiets}: {userIntolerances: string[], userDiets: string[]}) => void
    handleChange: (event: React.ChangeEvent<HTMLInputElement>) => void
    formData: RecipeAuthFormData
}

interface CurrentUserData {
    user: User
    userEmail: string,
    userIntolerances: string[],
    userDiets: string[]
}



// export type {RecipeToggleNavBar, RecipeAuthFormResult, RecipeNewUserFirebaseId, RecipeAuthFormData, RecipeIngredientData, RecipeAuthFormEvents}
export type {RecipeToggleNavBar, RecipeAuthFormResult, RecipeUserAccountInfo, RecipeAuthFormData, RecipeIngredientData, RecipeRegistrationFormEvents, RecipeLoginFormEvents, CurrentUserData}