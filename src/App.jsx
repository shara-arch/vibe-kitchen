import { useState } from 'react'
import './App.css'
import { RecipeProvider } from './context/RecipeContext'
import { DiscoverRecipes, MyRecipes } from './pages'

function App() {
    const [activePage, setActivePage] = useState('discover')

    return (
        <RecipeProvider>
            <div className="app-shell">
                <header className="app-header">
                    <div className="app-brand">
                        <span className="brand-icon">🍽️</span>
                        <h1 className="brand-name">Vibe Kitchen</h1>
                    </div>
                    <nav className="app-nav">
                        <button
                            type="button"
                            className={`nav-tab${activePage === 'discover' ? ' nav-tab--active' : ''}`}
                            onClick={() => setActivePage('discover')}
                        >
                            Discover
                        </button>
                        <button
                            type="button"
                            className={`nav-tab${activePage === 'my-recipes' ? ' nav-tab--active' : ''}`}
                            onClick={() => setActivePage('my-recipes')}
                        >
                            My Recipes
                        </button>
                    </nav>
                </header>

                <main className="app-main">
                    {activePage === 'discover' ? <DiscoverRecipes /> : <MyRecipes />}
                </main>
            </div>
        </RecipeProvider>
    )
}

export default App
