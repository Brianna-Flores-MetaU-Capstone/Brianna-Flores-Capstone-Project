import { useEffect } from "react";
import { useNavigate } from "react-router";
import { useUser } from "../../contexts/UserContext";
const databaseUrl = import.meta.env.VITE_DATABASE_URL;
import axios from "axios";
import { axiosConfig } from "../../utils/databaseHelpers";
import type { GPUserAccountType } from "../../utils/types/authTypes";

const WithAuth = <T extends object>(
  WrappedComponent: React.ComponentType<T>,
) => {
  return function AuthComponent(props: T) {
    const { user, setUser } = useUser();
    const navigate = useNavigate();

    useEffect(() => {
      if (!user) {
        axios
          .get<GPUserAccountType>(`${databaseUrl}/me`, axiosConfig)
          .then(function (response) {
            // handle success
            if (response.data.id) {
              setUser(response.data);
            }
          })
          .catch(function () {
            navigate("/login");
          });
      }
    }, [user, setUser, navigate]);

    if (!user) {
      return <p>Loading...</p>; // Prevents flickering before redirection
    }

    return <WrappedComponent {...props} />;
  };
};

export default WithAuth;
