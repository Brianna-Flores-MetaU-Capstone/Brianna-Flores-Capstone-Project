import type { CurrentUserData } from "./types"
import type { User } from "firebase/auth";
 
 const updateAccount = async ({user, userEmail, userIntollerances, userDiets}: CurrentUserData) => {
    const updatedUser = await fetch(
      `http://localhost:3000/account/${user.uid}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: userEmail,
          intollerances: userIntollerances,
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
            userIntollerances: data.intollerances, 
            userDiets: data.diets
        }
        return userDataObj
        // setUserEmail(data.email);
        // setUserIntollerances(data.intollerances);
        // setUserDiets(data.diets);
      } catch (error) {
        console.error(error);
      }
    };

  export { updateAccount, getUserData }