import type { CurrentUserData } from "./types"
import type { User } from "firebase/auth";
 
 const updateAccount = async ({user, userEmail, userIntolerances, userDiets}: CurrentUserData) => {
    const updatedUser = await fetch(
      `http://localhost:3000/account/${user.uid}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: userEmail,
          intolerances: userIntolerances,
          diets: userDiets,
        }),
      }
    );
    if (!updatedUser.ok) {
      throw new Error("Failed to update user");
    }
    const data = await updatedUser.json();
    return data;
  };


    const getUserData = async (user: User) => {
      try {
        const fetchedUserData = await fetch(
          `http://localhost:3000/account/${user.uid}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        if (!fetchedUserData.ok) {
          throw new Error("Failed to get user data");
        }
        const data = await fetchedUserData.json();
        const userDataObj: CurrentUserData = {
            user, 
            userEmail: data.email, 
            userIntolerances: data.intolerances, 
            userDiets: data.diets
        }
        return userDataObj
      } catch (error) {
        console.error(error);
      }
    };

  export { updateAccount, getUserData }