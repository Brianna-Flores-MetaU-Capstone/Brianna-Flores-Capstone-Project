import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router";
import { useState } from "react";
import { CssVarsProvider } from "@mui/joy";
import { theme } from "./utils/UIStyle";

// import pages for routing
import Homepage from "./pages/Homepage";
import NewListPage from "./pages/NewListPage";
import IngredientsPage from "./pages/IngredientsPage";
import LoginPage from "./pages/LoginPage";
import NoMatchPage from "./pages/NoMatchPage";
import GroceryList from "./pages/GroceryList";
import SignupForm from "./pages/SignupForm";
import AccountPage from "./pages/AccountPage";
import WithAuth from "./components/WithAuth";

function App() {
  const [navOpen, setNavOpen] = useState<boolean>(false);

  const ProtectedNewListPage = WithAuth(NewListPage);
  const ProtectedIngredientsList = WithAuth(IngredientsPage);
  const ProtectedGroceryList = WithAuth(GroceryList);
  const ProtectedAccountPage = WithAuth(AccountPage);

  return (
    <CssVarsProvider theme={theme}>
      <BrowserRouter>
        <Routes>
          <Route path="" element={<Homepage />} />
          <Route path="new-list" element={<ProtectedNewListPage />} />
          <Route path="ingredients" element={<ProtectedIngredientsList />} />
          <Route path="grocery-list" element={<ProtectedGroceryList />} />
          <Route path="*" element={<NoMatchPage />} />
          <Route path="login" element={<LoginPage />} />
          <Route path="signup" element={<SignupForm />} />
          <Route path="account" element={<ProtectedAccountPage />} />
        </Routes>
      </BrowserRouter>
    </CssVarsProvider>
  );
}

export default App;
