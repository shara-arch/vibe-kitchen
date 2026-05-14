import { Routes, Route } from 'react-router-dom';
import Navbar from './components/NavBar.jsx';
import DiscoverPage from './Pages/DiscoverPage.jsx';

export default function App(){
    return (
        <div>
        <div className='min-h-screen bg-stone-50'>
            <Navbar/>
            <Routes>
            <Route path ="/" element={<DiscoverPage/>} />
            </Routes>
        </div>
        </div>
    )
}