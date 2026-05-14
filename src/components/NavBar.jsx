//Import Navlink for client-side routing with active state awareness
import { NavLink } from 'react-router-dom';
//Icons for styling the nav Bar
import { UtensilsCrossed, Compass, BookOpen } from 'lucide-react';


export default function Navbar(){
    return(
        <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-stone-200 shadow-sm">
            <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
                <div className="flex items-center gap-3">           
            <div className="bg-amber-500 text-white p-2 rounded-xl group-hover:bg-amber-600 transition-colors">
            {/* Logo Section */}

                <UtensilsCrossed size={20}/>
            </div>
            <div>
            <h1 className="text-xl font-bold text-stone-800 leading-tight">Vibe Kitchen</h1>
            <p className="text-xs text-stone-500 leading-tight">Cook based on your mood.</p>
            </div>
            </div>
            <nav className="flex items-center gap-2">
                {/* Navigates to the homepage */}
                <NavLink to="/"
                // Changes the matching logic for the active and pending states to only match to the "end" of the NavLinkProps.to. If the URL is longer, it will no longer be considered active.
                end 
                className={({ isActive }) =>
                        `flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${isActive
                        ? 'bg-amber-500 text-white shadow-sm'
                        : 'text-stone-600 hover:bg-stone-100'
                         }`
                        } >
                <Compass size={16}/> Discover
                </NavLink>
                <NavLink to="/my-recipes" className={({ isActive }) =>
                        `flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${isActive
                            ? 'bg-amber-500 text-white shadow-sm'
                            : 'text-stone-600 hover:bg-stone-100'
                        }`} >
                <BookOpen size={16} /> My Recipes
                </NavLink>
            </nav>
            </div>
        </header>
    );
}