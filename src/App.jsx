import { Routes, Route } from "react-router-dom";
import Navbar from "./components/NavBar.jsx";
import DiscoverPage from "./Pages/DiscoverPage.jsx";
import MyRecipes from "./Pages/MyRecipes.jsx";
import RecipeDetail from "./Pages/RecipeDetail.jsx";

export default function App() {
  return (
    <div>
      <div className="min-h-screen bg-stone-50">
        <Navbar />
        <Routes>
          <Route path="/" element={<DiscoverPage />} />
          <Route path="/my-recipes" element={<MyRecipes />} />
          <Route path="/recipe/:id" element={<RecipeDetail />} />
        </Routes>
      </div>
    </div>
  );
}
