// import { useState } from 'react'
import './App.css'
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router";

// import pages for routing
import Homepage from './pages/Homepage';
import NewListPage from './pages/NewListPage';
import IngredientsPage from './pages/IngredientsPage';
import RecipesPage from './pages/RecipesPage';
import LoginPage from './pages/LoginPage';
import CreateRecipePage from './pages/CreateRecipePage';
import NoMatchPage from './pages/NoMatchPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="" element={<Homepage />} />
        <Route path="new-list" element={<NewListPage />} />
        <Route path="ingredients" element={<IngredientsPage />} />
        <Route path="recipes" element={<RecipesPage />}>
          <Route path="create" element={<CreateRecipePage />} />
        </Route>
        <Route path="login" element={<LoginPage />} />
        <Route path="*" element={<NoMatchPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
