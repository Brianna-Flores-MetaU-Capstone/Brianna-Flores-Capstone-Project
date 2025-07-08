import type {
  GPCurrentUserTypes,
  GPAccountInfoTypes,
  GPErrorMessageTypes,
  GPIngredientDataTypes,
} from "./types";
import type { User } from "firebase/auth";


type GPUpdateAccountHelperTypes = GPCurrentUserTypes & {
  setMessage: (
    value: React.SetStateAction<GPErrorMessageTypes | undefined>
  ) => void;
};

const updateAccount = async ({
  user,
  userEmail,
  userIntolerances,
  userDiets,
  setMessage,
}: GPUpdateAccountHelperTypes) => {
  const updatedUser = await fetch(`http://localhost:3000/account/${user.uid}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: userEmail,
      intolerances: userIntolerances,
      diets: userDiets,
    }),
    credentials: "include",
  });
  if (!updatedUser.ok) {
    setMessage({ error: true, message: "Failed to update user" });
  }
  const data = await updatedUser.json();
  return data;
};

type UserDataHelperTypes = {
  user: User;
  setMessage: (
    value: React.SetStateAction<GPErrorMessageTypes | undefined>
  ) => void;
};

const getUserData = async ({ user, setMessage }: UserDataHelperTypes) => {
  try {
    const fetchedUserData = await fetch(
      `http://localhost:3000/account/${user.uid}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      }
    );
    if (!fetchedUserData.ok) {
      setMessage({ error: true, message: "Failed to get user data" });
    }
    const data = await fetchedUserData.json();
    const userDataObj: GPCurrentUserTypes = {
      user,
      userEmail: data.email,
      userIntolerances: data.intolerances,
      userDiets: data.diets,
    };
    return userDataObj;
  } catch (error) {
    // TODO use error state
    console.error(error);
  }
};

type GPNewUserHelperTypes = {
  newUser: GPAccountInfoTypes;
  setMessage: (
    value: React.SetStateAction<GPErrorMessageTypes | undefined>
  ) => void;
};

const handleNewUser = async ({ newUser, setMessage }: GPNewUserHelperTypes) => {
  try {
    const response = await fetch("http://localhost:3000/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newUser),
      credentials: "include",
    });
    if (!response.ok) {
      setMessage({ error: true, message: "Failed to add user to database" });
    }
    const data = await response.json();
    return data
  } catch (error) {
    // TODO use error state
    console.error(error);
  }
};

const validateUserToken = async(user: User) => {
  const token = await user.getIdToken(true);
  // Send token to your backend via HTTPS
  const response = await fetch("http://localhost:3000/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ token }),
    credentials: "include",
  });
  if (!response.ok) {
    return false;
  }
  return true;
}

type fetchUserIngredientsTypes = {
  setMessage: (
    value: React.SetStateAction<GPErrorMessageTypes | undefined>
  ) => void;
};

  const fetchUserIngredientsHelper = async ({setMessage}: fetchUserIngredientsTypes) => {
      try {
        const response = await fetch("http://localhost:3000/ingredients", {
          method: "GET",
          credentials: "include",
        });
        if (!response.ok) {
          setMessage({
            error: true,
            message: "Error displaying user ingredients",
          });
          return;
        }
        const data = await response.json();
        return data;
      } catch (error) {
        setMessage({
          error: true,
          message: "Error displaying user ingredients",
        });
      }
    };

    type DeleteUserIngredientTypes = {
      setMessage: (
        value: React.SetStateAction<GPErrorMessageTypes | undefined>
      ) => void;
      ingredient: GPIngredientDataTypes
    }
    const deleteIngredient = async ({setMessage, ingredient}: DeleteUserIngredientTypes) => {
      const response = await fetch(
        `http://localhost:3000/ingredients/${ingredient.id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        }
      );
      if (!response.ok) {
        setMessage({ error: true, message: "Failed to delete ingredient" });
        return;
      }
      // const data = await response.json();
      setMessage({ error: false, message: "Sucessfully deleted ingredient" });
    }

export { updateAccount, getUserData, handleNewUser, validateUserToken, fetchUserIngredientsHelper, deleteIngredient };
