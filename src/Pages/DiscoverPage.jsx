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
  const [meals, setMeals] = useState([]);

  useEffect(() => {
    fetch('http://localhost:5000/meals')
      .then(res => res.json())
      .then(data => setMeals(data))
      .catch(err => console.error('Error fetching meals:', err));
  }, []);
  const filteredMeals = activeFilters.length
    ? meals.filter(m =>
        // Determines whether the specified callback function returns true for any element of an array.
        activeFilters.some(f => m.MealCategory?.toLowerCase().includes(f.toLowerCase()))
      )
    : meals;
  return(
    <main className='max-w-6xl mx-auto px-4 py-8'>
        <About />
        <MoodSelector selectedMood={selectedMood} onMoodSelect={setSelectedMood}/>
        <SearchBar value={searchQuery} onChange={setSearchQuery}/>
        <div className='flex items-center justify-between mb-4'>
            {filteredMeals.length > 0 && (
                <p className="text-sm text-stone-500">
                    Showing <span className="font-semibold text-stone-700">{filteredMeals.length}</span> recipes
                    {selectedMood && <span> for <span className="font-semibold text-amber-600">{selectedMood}</span></span>}
                </p>
            )}
            <button onClick={() => setShowFilters(!showFilters)} className={`ml-auto flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium border transition-all ${
                 showFilters || activeFilters.length > 0
                ? 'bg-amber-500 border-amber-500 text-white'
                : 'bg-white border-stone-200 text-stone-600 hover:border-amber-400 hover:text-amber-600'
                }`}> <SlidersHorizontal size={15}/> Filters
            {activeFilters.length > 0 && (
            <span className="bg-white/30 text-white text-xs rounded-full px-1.5">{activeFilters.length}</span>
          )}
          </button>
        </div>
        {showFilters && (
        <FilterPanel activeFilters={activeFilters} onFilterChange={setActiveFilters} />
      )}
      <RecipeGrid meals={filteredMeals} />
    </main>
  )
}