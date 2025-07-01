import type { RecipeNewUserFirebaseId, RecipeAuthFormData } from "./types";

const validateInput = (formData: RecipeAuthFormData) => {
  if (!formData.email || !formData.password) {
    return { type: "error", text: "Email and password are required" };
  }

  if (formData.password.length < 8) {
    return {
      type: "error",
      text: "Password must be at least 8 characters long",
    };
  }
  return { type: "", text: "" };
};

const handleNewUser = async (newUser: RecipeNewUserFirebaseId) => {
    try {
      console.log(newUser);
      console.log(JSON.stringify(newUser))
      const response = await fetch("http://localhost:3000/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newUser),
      });
      if (!response.ok) {
        throw new Error("Failed to create user");
      }
      const data = await response.json();
      console.log("data returned", data)
    } catch (error) {
      console.error(error);
    }
  };

export { validateInput, handleNewUser };
