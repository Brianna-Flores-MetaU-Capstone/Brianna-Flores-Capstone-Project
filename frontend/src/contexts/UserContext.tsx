import { createContext, useState, useContext, useEffect } from "react";
const databaseUrl = import.meta.env.VITE_DATABASE_URL;

type GPUserAccountType = {
  id: string;
  userName: string;
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
    fetch(`${databaseUrl}/me`, { credentials: "include" })
      .then((response) => response.json())
      .then((data) => {
        if (data.id) {
          setUser(data);
        }
      });
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
