import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router";
import { useState } from "react";

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
    <BrowserRouter>
      <Routes>
        <Route
          path=""
          element={
            <Homepage
              navOpen={navOpen}
              toggleNav={() => setNavOpen((prev) => !prev)}
            />
          }
        />
        <Route
          path="new-list"
          element={
            <ProtectedNewListPage
              navOpen={navOpen}
              toggleNav={() => setNavOpen((prev) => !prev)}
            />
          }
        />
        <Route
          path="ingredients"
          element={
            <ProtectedIngredientsList
              navOpen={navOpen}
              toggleNav={() => setNavOpen((prev) => !prev)}
            />
          }
        />
        <Route
          path="grocery-list"
          element={
            <ProtectedGroceryList
              navOpen={navOpen}
              toggleNav={() => setNavOpen((prev) => !prev)}
            />
          }
        />
        <Route
          path="*"
          element={
            <NoMatchPage
              navOpen={navOpen}
              toggleNav={() => setNavOpen((prev) => !prev)}
            />
          }
        />
        <Route
          path="login"
          element={
            <LoginPage
              navOpen={navOpen}
              toggleNav={() => setNavOpen((prev) => !prev)}
            />
          }
        />
        <Route
          path="signup"
          element={
            <SignupForm
              navOpen={navOpen}
              toggleNav={() => setNavOpen((prev) => !prev)}
            />
          }
        />
        <Route
          path="account"
          element={
            <ProtectedAccountPage
              navOpen={navOpen}
              toggleNav={() => setNavOpen((prev) => !prev)}
            />
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
