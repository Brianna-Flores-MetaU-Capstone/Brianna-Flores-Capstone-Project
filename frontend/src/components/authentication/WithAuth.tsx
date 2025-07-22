import { useEffect } from "react";
import { useNavigate } from "react-router";
import { useUser } from "../../contexts/UserContext";
const databaseUrl = import.meta.env.VITE_DATABASE_URL;
import axios from "axios";
import { axiosConfig } from "../../utils/databaseHelpers";

const WithAuth = <T extends object>(
  WrappedComponent: React.ComponentType<T>,
) => {
  return function AuthComponent(props: T) {
    const { user, setUser } = useUser();
    const navigate = useNavigate();

    useEffect(() => {
      if (!user) {
        axios
          .get(`${databaseUrl}/me`, axiosConfig)
          .then(function (response) {
            // handle success
            if (response.data.id) {
              setUser(response.data);
            }
          })
          .catch(function (error) {
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
