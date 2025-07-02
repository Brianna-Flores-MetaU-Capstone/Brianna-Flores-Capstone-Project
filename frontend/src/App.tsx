import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router";
import { useState } from 'react';

// import pages for routing
import Homepage from './pages/Homepage';
import NewListPage from './pages/NewListPage';
import IngredientsPage from './pages/IngredientsPage';
import RecipesPage from './pages/RecipesPage';
import LoginPage from './pages/LoginPage';
import CreateRecipePage from './pages/CreateRecipePage';
import NoMatchPage from './pages/NoMatchPage';
import GroceryList from './pages/GroceryList';
import SignupForm from './pages/SignupForm';
import AccountPage from './pages/AccountPage';


function App() {
  const [navOpen, setNavOpen] = useState<boolean>(false);

  return (
      <BrowserRouter>
        <Routes>
          <Route path="" element={<Homepage navOpen={ navOpen } toggleNav={ () => setNavOpen((prev) => !prev) } />} />
          <Route path="new-list" element={<NewListPage navOpen={ navOpen } toggleNav={ () => setNavOpen((prev) => !prev) }/>} />
          <Route path="ingredients" element={<IngredientsPage navOpen={ navOpen } toggleNav={ () => setNavOpen((prev) => !prev) }/>} />
          <Route path="recipes" element={<RecipesPage navOpen={ navOpen } toggleNav={ () => setNavOpen((prev) => !prev) }/>}>
            <Route path="create" element={<CreateRecipePage />} />
          </Route>
          <Route path="grocery-list" element={<GroceryList navOpen={ navOpen } toggleNav={ () => setNavOpen((prev) => !prev) }/>} />
          <Route path="*" element={<NoMatchPage navOpen={ navOpen } toggleNav={ () => setNavOpen((prev) => !prev) }/>} />
          <Route path="login" element={<LoginPage navOpen={ navOpen } toggleNav={ () => setNavOpen((prev) => !prev) }/>} />
          <Route path="signup" element={<SignupForm navOpen={ navOpen } toggleNav={ () => setNavOpen((prev) => !prev) }/>} />
          <Route path="account" element={<AccountPage navOpen={ navOpen } toggleNav={ () => setNavOpen((prev) => !prev) }/>} />
        </Routes>
      </BrowserRouter>
  )
}

export default App
