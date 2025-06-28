import type { newUserType, formData } from "./types";

const validateInput = (formData: formData) => {
  if (!formData.username || !formData.password) {
    return { type: "error", text: "Username and password are required" };
  }

  if (formData.password.length < 8) {
    return {
      type: "error",
      text: "Password must be at least 8 characters long",
    };
  }
  return { type: "", text: "" };
};

const handleNewUser = async (newUser: newUserType) => {
    try {
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
      console.log("successfully created a user: ", data);
    } catch (error) {
      console.error(error);
    }
  };

export { validateInput, handleNewUser };
