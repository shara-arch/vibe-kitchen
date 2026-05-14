import { Routes, Route } from 'react-router-dom';
import Navbar from './components/NavBar.jsx';
import DiscoverPage from './pages/DiscoverPage.jsx';
import MyRecipes from './pages/MyRecipes.jsx';

export default function App(){
    return (
        <div>
        <div className='min-h-screen bg-stone-50'>
            <Navbar/>
            <Routes>
            <Route path="/" element={<DiscoverPage/>} />
            <Route path="/my-recipes" element={<MyRecipes/>} />
            </Routes>
        </div>
        </div>
    )
}