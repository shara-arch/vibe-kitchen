import { useState, useEffect } from "react";
import { SlidersHorizontal } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { fetchRecipes } from "../features/recipes/recipesSlice.js";
import MoodSelector from "../components/MoodSelector.jsx";
import SearchBar from "../components/SearchBar.jsx";
import FilterPanel from "../components/FilterPanel.jsx";
import RecipeGrid from "../components/RecipeGrid.jsx";
import About from "../components/About.jsx";

export default function DiscoverPage() {
  const dispatch = useDispatch();
  const { meals, mealsStatus } = useSelector((state) => state.recipes);

  const [selectedMood, setSelectedMood] = useState(null);
  const [moodCategories, setMoodCategories] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [activeFilters, setActiveFilters] = useState([]);

  // Fetch meals only if not already loaded in the store
  useEffect(() => {
    if (meals.length === 0 && mealsStatus === "idle") {
      dispatch(fetchRecipes());
    }
  }, [dispatch, meals.length, mealsStatus]);

  const loading = mealsStatus === "loading";

  const filteredMeals = meals.filter((meal) => {
    if (selectedMood && moodCategories.length > 0) {
      const matchesMood = moodCategories.some(
        (category) =>
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
            Showing{" "}
            <span className="font-semibold text-stone-700">
              {filteredMeals.length}
            </span>{" "}
            recipes
            {selectedMood && (
              <span>
                {" "}
                for{" "}
                <span className="font-semibold text-amber-600">
                  {selectedMood}
                </span>
              </span>
            )}
          </p>
        )}

        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`ml-auto flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium border transition-all ${
            showFilters || activeFilters.length > 0
              ? "bg-amber-500 border-amber-500 text-white"
              : "bg-white border-stone-200 text-stone-600 hover:border-amber-400 hover:text-amber-600"
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
        <FilterPanel
          activeFilters={activeFilters}
          onFilterChange={setActiveFilters}
        />
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