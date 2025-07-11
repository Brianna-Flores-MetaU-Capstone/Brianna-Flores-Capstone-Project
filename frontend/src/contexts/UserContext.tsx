import { createContext, useState, useContext, useEffect } from "react";
import axios from "axios";
const databaseUrl = import.meta.env.VITE_DATABASE_URL;

type GPUserAccountType = {
  id: string;
  userName: string;
  intolerances: string[];
  diets: string[];
};

type GPAccountContextType = {
  user: GPUserAccountType | null;
  setUser: React.Dispatch<React.SetStateAction<null>>;
};

// sets up global state to access anywhere in app
const UserContext = createContext<GPAccountContextType>({
  user: null,
  setUser: () => {},
});

// provider is used to store auth data and have components update it
export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    axios
      .get(`${databaseUrl}/me`, { withCredentials: true })
      .then(function (response) {
        if (response.data.id) {
          setUser(response.data);
        }
      })
      .catch(function (error) {
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
