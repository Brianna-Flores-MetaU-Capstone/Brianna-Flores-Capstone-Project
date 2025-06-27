type navigationTypes = {
    navOpen: boolean;
    toggleNav: () => void 
}

interface searchRequestType {
    numToRequest: number
    offset: number
}

export type {navigationTypes, searchRequestType}