import type { User } from "firebase/auth";

interface RecipeToggleNavBarProps {
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

interface RecipeAuthFormEventProps {
    handleRegistrationSubmit?: ({userIntolerances, userDiets}: {userIntolerances: string[], userDiets: string[]}) => void
    handleLoginSubmit?: (event: React.FormEvent) => void
    handleAuthInputChange: (event: React.ChangeEvent<HTMLInputElement>) => void
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

interface UserRequestFormData {
    recipeName: string
    servings: string
}

interface AddAnotherMealProps {
    handleModalClose: () => void
    onSelectRecipe: (data: RecipeData) => void
    modalOpen: boolean
}

interface PasswordAuthenticationProps {
    handleAccountSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
    handleInputChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

interface GroceryListDepartmentProps {
    department: string
    handleOpenModal: (ingredient: IngredientData) => void
}

interface UniversalIngredientProps {
    ingredient: IngredientData
    groceryCheck: boolean
    presentExpiration: boolean
    presentButtons: boolean
    onEdit?: (ingredient: IngredientData) => void
}

interface UniversalIngredientModalProps {
    modalFor: string
    ingredientData?: IngredientData
    onClose: () => void
    modalOpen: boolean
}

export type {RecipeToggleNavBarProps, RecipeUserAccountInfo, RecipeAuthFormData, RecipeAuthFormEventProps, CurrentUserData, IngredientData, RecipeData, AuthFormResultMessage, UserRequestFormData, AddAnotherMealProps, PasswordAuthenticationProps, GroceryListDepartmentProps, UniversalIngredientProps, UniversalIngredientModalProps }
