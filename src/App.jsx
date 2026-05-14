import { Provider } from 'react-redux'
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import store from './store.js'
import Home from './pages/Home.jsx'
import MyRecipes from './pages/MyRecipes.jsx'
import RecipeDetail from './pages/RecipeDetail.jsx'
import './App.css'

export default function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <div className="app-shell">
          <header className="topbar">
            <div className="brand">
              <Link to="/">VibeKitchen</Link>
            </div>
            <nav className="nav-links">
              <Link to="/">Discover</Link>
              <Link to="/my-recipes">My recipes</Link>
            </nav>
          </header>

          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/my-recipes" element={<MyRecipes />} />
            <Route path="/recipes/:id" element={<RecipeDetail />} />
          </Routes>

          <footer className="footer">
            <p>VibeKitchen helps cook meals by mood, filter, or your own personalized recipes.</p>
          </footer>
        </div>
      </BrowserRouter>
    </Provider>
  )
}

