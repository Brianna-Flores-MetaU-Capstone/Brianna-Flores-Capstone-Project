import { BrowserRouter, Routes, Route } from "react-router";
import { CssVarsProvider } from "@mui/joy";
import { theme } from "./utils/style/UIStyle";

import Homepage from "./pages/Homepage";
import NewListPage from "./pages/NewListPage";
import IngredientsPage from "./pages/IngredientsPage";
import LoginPage from "./pages/LoginPage";
import NoMatchPage from "./pages/NoMatchPage";
import GroceryList from "./pages/GroceryList";
import SignupForm from "./pages/SignupForm";
import AccountPage from "./pages/AccountPage";
import WithAuth from "./components/authentication/WithAuth";
import RecipeDiscoveryPage from "./pages/RecipeDiscoveryPage";
import FavoritedRecipes from "./pages/FavoritedRecipes";
import EditedRecipesPage from "./pages/EditedRecipesPage";

function App() {
  const AuthNewListPage = WithAuth(NewListPage);
  const AuthIngredientsList = WithAuth(IngredientsPage);
  const AuthGroceryList = WithAuth(GroceryList);
  const AuthAccountPage = WithAuth(AccountPage);
  const AuthFavoritedPage = WithAuth(FavoritedRecipes);
  const AuthEditedPage = WithAuth(EditedRecipesPage);

  return (
    <CssVarsProvider theme={theme}>
      <BrowserRouter>
        <Routes>
          <Route path="" element={<Homepage />} />
          <Route path="new-list" element={<AuthNewListPage />} />
          <Route path="ingredients" element={<AuthIngredientsList />} />
          <Route path="grocery-list" element={<AuthGroceryList />} />
          <Route path="*" element={<NoMatchPage />} />
          <Route path="login" element={<LoginPage />} />
          <Route path="signup" element={<SignupForm />} />
          <Route path="account" element={<AuthAccountPage />} />
          <Route path="discovery" element={<RecipeDiscoveryPage />} />
          <Route path="favorited" element={<AuthFavoritedPage />} />
          <Route path="edited" element={<AuthEditedPage />} />
        </Routes>
      </BrowserRouter>
    </CssVarsProvider>
  );
}

export default App;
