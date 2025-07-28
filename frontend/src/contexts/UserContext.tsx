import { createContext, useState, useContext, useEffect } from "react";
import type { GPUserAccountType } from "../utils/types/authTypes";
import axios from "axios";
const databaseUrl = import.meta.env.VITE_DATABASE_URL;



type GPAccountContextType = {
  user: GPUserAccountType | null;
  setUser: React.Dispatch<React.SetStateAction<GPUserAccountType | null>>;
};

// sets up global state to access anywhere in app
const UserContext = createContext<GPAccountContextType>({
  user: null,
  setUser: () => {},
});

// provider is used to store auth data and have components update it
export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<GPUserAccountType | null>(null);

  useEffect(() => {
    axios
      .get<GPUserAccountType>(`${databaseUrl}/me`, { withCredentials: true })
      .then(function (response) {
        if (response.data.id) {
          setUser(response.data);
        }
      })
      .catch(function () {
        setUser(null);
      });
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
