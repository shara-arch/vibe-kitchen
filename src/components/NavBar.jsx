//Import Navlink for client-side routing with active state awareness
import { NavLink } from 'react-router-dom';
//Icons for styling the nav Bar
import { UtensilsCrossed, Compass, BookOpen } from 'lucide-react';


export default function Navbar(){
    return(
        <header>
            <div>            
            <div>
            {/* Logo Section */}

                <UtensilsCrossed size={20}/>
            </div>
            <div>
            <h1>Vibe Kitchen</h1>
            <p>Cook based on your mood.</p>
            </div>
            <nav>
                {/* Navigates to the homepage */}
                <NavLink to="/" >
                <Compass size={16}/> Discover
                </NavLink>
                <NavLink to="/my-recipes" className={} >
                <BookOpen size={16} /> My Recipes
                </NavLink>
            </nav>
            </div>
        </header>
    );
}