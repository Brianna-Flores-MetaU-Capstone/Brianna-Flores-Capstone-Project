import { createContext, useState, useContext, useEffect } from "react";

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

  // check if session exists when app starts
  useEffect(() => {
    fetch("http://localhost:3000/me", { credentials: "include" })
      .then((response) => response.json())
      .then((data) => {
        if (data.id) {
          setUser(data); // Persist login state
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
