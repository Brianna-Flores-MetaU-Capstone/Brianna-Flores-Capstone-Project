type navigationTypes = {
    navOpen: boolean;
    toggleNav: () => void 
}

type messageTypes = {
    type: string
    text: string
}

type newUserType = {
    id: string
    email: string
}

export type {navigationTypes, messageTypes, newUserType}