import { createContext, useState, useContext } from "react";
import type { GPPreferredBlockType } from "../utils/types";

type GPEventContextType = {
  userPreferences: GPPreferredBlockType[] | null;
  setUserPreferences: React.Dispatch<React.SetStateAction<GPPreferredBlockType[]>>;
};

const UserPreferenceContexts = createContext<GPEventContextType>({
  userPreferences: null,
  setUserPreferences: () => {},
});

export const UserPreferenceProvider = ({children}: {children: React.ReactNode}) => {
    const [userPreferences, setUserPreferences] = useState<GPPreferredBlockType[]>([]);
    return (
        <UserPreferenceContexts.Provider value={{userPreferences, setUserPreferences}}>
            {children}
        </UserPreferenceContexts.Provider>
    )
}

export const useUserPreferences = () => useContext(UserPreferenceContexts)
