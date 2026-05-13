import { useState, useEffect } from 'react';
import { SlidersHorizontal } from 'lucide-react';
import MoodSelector from '../components/MoodSelector.jsx';
import SearchBar from '../components/SearchBar.jsx';
import FilterPanel from '../components/FilterPanel.jsx';
import RecipeGrid from '../components/RecipeGrid.jsx';
import About from '../components/About.jsx';

export default function DiscoverPage() {
  const [selectedMood, setSelectedMood] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [activeFilters, setActiveFilters] = useState([]);
  const filteredMeals = activeFilters.length
    ? meals.filter(m =>
        // Determines whether the specified callback function returns true for any element of an array.
        activeFilters.some(f => m.MealCategory?.toLowerCase().includes(f.toLowerCase()))
      )
    : meals;
  return(
    <main>
        <About />
        <MoodSelector selectedMood={selectedMood} onMoodSelect={setSelectedMood}/>
        <SearchBar value={searchQuery} onChange={setSearchQuery}/>
        <div>
            {filteredMeals.length > 0 && (
                <p className="">
                    Showing <span className="">{filteredMeals.length}</span> recipes
                    {selectedMood && <span> for <span className="">{selectedMood}</span></span>}
                </p>
            )}
            <button className=""> <SlidersHorizontal size={15}/> Filters
            {activeFilters.length > 0 && (
            <span className="">{activeFilters.length}</span>
          )}
          </button>
        </div>
        {showFilters && (
        <FilterPanel activeFilters={activeFilters} onFilterChange={setActiveFilters} />
      )}
      <RecipeGrid meal={filteredMeals} />
    </main>
  )
}