import { useState, useEffect } from "react";
import { SlidersHorizontal } from "lucide-react";
import MoodSelector from "../components/MoodSelector.jsx";
import SearchBar from "../components/SearchBar.jsx";
import FilterPanel from "../components/FilterPanel.jsx";
import RecipeGrid from "../components/RecipeGrid.jsx";
import About from "../components/About.jsx";

export default function DiscoverPage() {
  const [selectedMood, setSelectedMood] = useState(null);
  const [moodCategories, setMoodCategories] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [activeFilters, setActiveFilters] = useState([]);
  const [meals, setMeals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchMeals() {
      try {
        const categories = ["Breakfast", "Chicken", "Seafood", "Vegetarian", "Beef", "Pasta", "Dessert", "Pork", "Side", "Starter", "Vegan", "Miscellaneous", "Goat", "Lamb"];

        const results = await Promise.all(
          categories.map((cat) =>
            fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${cat}`)
              .then((res) => res.json()),
          ),
        );

        const mealIds = results.map((r) => r.meals.slice(0, 8)).flat();

        const detailed = await Promise.all(
          mealIds.map((meal) =>
            fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${meal.idMeal}`)
              .then((res) => res.json())
              .then((d) => d.meals?.[0] ?? null),
          ),
        );

        setMeals(detailed.filter((meal) => meal !== null));
      } catch (err) {
        console.error("Error message: ", err);
      } finally {
        setLoading(false);
      }
    }

    fetchMeals();
  }, []);

  const filteredMeals = meals.filter((meal) => {
    if (selectedMood && moodCategories.length > 0) {
      const matchesMood = moodCategories.some((category) =>
        meal.strCategory?.toLowerCase() === category.toLowerCase(),
      );
      if (!matchesMood) return false;
    }

    if (activeFilters.length > 0) {
      const matchesFilter = activeFilters.some((filter) =>
        meal.strCategory?.toLowerCase().includes(filter.toLowerCase()),
      );
      if (!matchesFilter) return false;
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        meal.strMeal?.toLowerCase().includes(query) ||
        meal.strCategory?.toLowerCase().includes(query) ||
        meal.strArea?.toLowerCase().includes(query)
      );
    }

    return true;
  });

  return (
    <main className="max-w-6xl mx-auto px-4 py-8">
      <About />

      <MoodSelector
        selectedMood={selectedMood}
        onMoodSelect={(name, categories) => {
          if (selectedMood === name) {
            setSelectedMood(null);
            setMoodCategories([]);
          } else {
            setSelectedMood(name);
            setMoodCategories(categories || []);
          }
        }}
      />

      <SearchBar value={searchQuery} onChange={setSearchQuery} />

      <div className="flex items-center justify-between mb-4">
        {filteredMeals.length > 0 && (
          <p className="text-sm text-stone-500">
            Showing <span className="font-semibold text-stone-700">{filteredMeals.length}</span> recipes
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

      {showFilters && <FilterPanel activeFilters={activeFilters} onFilterChange={setActiveFilters} />}

      {loading ? <p>Loading meals...</p> : <RecipeGrid meals={filteredMeals} />}
    </main>
  );
}