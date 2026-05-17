import { useState, useEffect } from 'react';
import { SlidersHorizontal } from 'lucide-react';
import MoodSelector from '../components/MoodSelector.jsx';
import SearchBar from '../components/SearchBar.jsx';
import FilterPanel from '../components/FilterPanel.jsx';
import RecipeGrid from '../components/RecipeGrid.jsx';
import About from '../components/About.jsx';

export default function DiscoverPage() {
  const [selectedMood, setSelectedMood] = useState(null);
  const [moodCategories, setMoodCategories] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [activeFilters, setActiveFilters] = useState([]);
  const [meals, setMeals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchMeals() {
      try {
        const categories = ["Breakfast","Chicken","Seafood",
          "Vegetarian","Beef","Pasta","Dessert","Pork","Side",
          "Starter","Vegan","Miscellaneous","Goat","Lamb",];

        const results = await Promise.all(
          categories.map((cat) =>
            fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${cat}`)
              .then((res) => res.json())
              .catch(() => ({ meals: [] }))  // don't let one bad category crash all
          )
        );

        const mealIds = results
          .filter((r) => r.meals !== null)   // same null-guard you used in handleMoodSelected
          .map((r) => r.meals.slice(0, 10))
          .flat();

        const detailed = await Promise.all(
          mealIds.map((meal) =>
            fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${meal.idMeal}`)
              .then((res) => res.json())
              .then((d) => d.meals?.[0] ?? null)
              .catch(() => null)
          )
        );

        setMeals(detailed.filter(Boolean));
      } catch (err) {
        console.error('Error fetching meals:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchMeals();
  }, []);

  // Mood filtering is client-side — no need to re-fetch from the API
  function handleMoodSelected(moodName, categories) {
    if (selectedMood === moodName) {
      setSelectedMood(null);
      setMoodCategories([]);
    } else {
      setSelectedMood(moodName);
      setMoodCategories(categories || []);
    }
  }

  const filteredMeals = meals.filter((meal) => {
    // 1. Mood filter
    if (selectedMood && moodCategories.length > 0) {
      const matchesMood = moodCategories.some(
        (cat) => meal.strCategory?.toLowerCase() === cat.toLowerCase()
      );
      if (!matchesMood) return false;
    }

    // 2. Active filters (panel)
    if (activeFilters.length > 0) {
      const matchesFilter = activeFilters.some((f) =>
        meal.strCategory?.toLowerCase().includes(f.toLowerCase())
      );
      if (!matchesFilter) return false;
    }

    // 3. Search query
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        meal.strMeal?.toLowerCase().includes(q) ||
        meal.strCategory?.toLowerCase().includes(q) ||
        meal.strArea?.toLowerCase().includes(q)
      );
    }

    return true;
  });

  return (
    <main className="max-w-6xl mx-auto px-4 py-8">
      <About />

      <MoodSelector
        selectedMood={selectedMood}
        onMoodSelect={handleMoodSelected}
      />

      <SearchBar value={searchQuery} onChange={setSearchQuery} />

      <div className="flex items-center justify-between mb-4">
        {filteredMeals.length > 0 && (
          <p className="text-sm text-stone-500">
            Showing{' '}
            <span className="font-semibold text-stone-700">{filteredMeals.length}</span>
            {' '}recipes
            {selectedMood && (
              <span>
                {' '}for{' '}
                <span className="font-semibold text-amber-600">{selectedMood}</span>
              </span>
            )}
          </p>
        )}

        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`ml-auto flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium border transition-all ${
            showFilters || activeFilters.length > 0
              ? 'bg-amber-500 border-amber-500 text-white'
              : 'bg-white border-stone-200 text-stone-600 hover:border-amber-400 hover:text-amber-600'
          }`}
        >
          <SlidersHorizontal size={15} /> Filters
          {activeFilters.length > 0 && (
            <span className="bg-white/30 text-white text-xs rounded-full px-1.5">
              {activeFilters.length}
            </span>
          )}
        </button>
      </div>

      {showFilters && (
        <FilterPanel activeFilters={activeFilters} onFilterChange={setActiveFilters} />
      )}

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-3">
          <div className="w-8 h-8 border-[3px] border-amber-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-stone-400 text-sm">Loading recipes…</p>
        </div>
      ) : (
        <RecipeGrid meals={filteredMeals} />
      )}
    </main>
  );
}