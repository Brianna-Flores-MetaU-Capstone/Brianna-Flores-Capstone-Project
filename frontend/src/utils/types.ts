type navigationTypes = {
    navOpen: boolean;
    toggleNav: () => void 
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

export type {navigationTypes, messageTypes, newUserType, formData}