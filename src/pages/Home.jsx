import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchMoodRecipes,
  searchRecipes,
  setConditionFilter,
  setDietaryFilter,
  toggleAllergy,
  clearFilters,
  selectFilteredRecipes,
  fetchUserRecipes,
} from "../features/recipes/recipesSlice";
import RecipeCard from "../components/RecipeCard.jsx";

const moods = [
  { id: "happy", label: "Happy" },
  { id: "tired", label: "Tired" },
  { id: "energetic", label: "Energetic" },
  { id: "cozy", label: "Cozy" },
  { id: "balanced", label: "Balanced" },
];

const diets = [
  { id: "high-protein", label: "High protein" },
  { id: "low-carbs", label: "Low carbs" },
];

const conditions = [
  { id: "diabetes", label: "Diabetes-friendly" },
  { id: "heart-healthy", label: "Heart healthy" },
];

const allergies = [
  { id: "nuts", label: "Nuts" },
  { id: "gluten", label: "Gluten" },
  { id: "dairy", label: "Dairy" },
];

export default function Home() {
  const dispatch = useDispatch();
  const [searchTerm, setSearchTerm] = useState("");
  const recipeState = useSelector((state) => state.recipes);
  const recipes = useSelector(selectFilteredRecipes);

  useEffect(() => {
    dispatch(fetchMoodRecipes("happy"));
    dispatch(fetchUserRecipes());
  }, [dispatch]);

  const handleMoodSelect = (mood) => {
    setSearchTerm("");
    dispatch(fetchMoodRecipes(mood));
  };

  const handleSearch = (event) => {
    event.preventDefault();
    if (searchTerm.trim()) {
      dispatch(searchRecipes(searchTerm.trim()));
    }
  };

  return (
    <main className="page-shell">
      <section className="hero-panel">
        <div>
          <p className="eyebrow">VibeKitchen</p>
          <h1>Discover recipes that match your mood.</h1>
          <p>
            Search meals or choose a vibe, then apply filters for diet,
            allergies, and health preferences.
          </p>
        </div>
      </section>

      <section className="controls-panel">
        <form className="search-bar" onSubmit={handleSearch}>
          <input
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder="Search recipes like 'chicken', 'pasta', 'salad'"
          />
          <button type="submit">Search</button>
        </form>

        <div className="selectors-grid">
          <div className="selector-group">
            <h2>Pick a mood</h2>
            <div className="chip-row">
              {moods.map((mood) => (
                <button
                  key={mood.id}
                  type="button"
                  className={
                    recipeState.mood === mood.id ? "chip selected" : "chip"
                  }
                  onClick={() => handleMoodSelect(mood.id)}
                >
                  {mood.label}
                </button>
              ))}
            </div>
          </div>

          <div className="selector-group">
            <h2>Dietary filters</h2>
            <div className="chip-row">
              {diets.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  className={
                    recipeState.filters.dietary === item.id
                      ? "chip selected"
                      : "chip"
                  }
                  onClick={() => dispatch(setDietaryFilter(item.id))}
                >
                  {item.label}
                </button>
              ))}
            </div>
            <h3>Health condition</h3>
            <div className="chip-row">
              {conditions.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  className={
                    recipeState.filters.condition === item.id
                      ? "chip selected"
                      : "chip"
                  }
                  onClick={() => dispatch(setConditionFilter(item.id))}
                >
                  {item.label}
                </button>
              ))}
            </div>
            <h3>Allergies</h3>
            <div className="chip-row">
              {allergies.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  className={
                    recipeState.filters.allergies.includes(item.id)
                      ? "chip selected"
                      : "chip"
                  }
                  onClick={() => dispatch(toggleAllergy(item.id))}
                >
                  {item.label}
                </button>
              ))}
            </div>
            <button
              type="button"
              className="clear-button"
              onClick={() => dispatch(clearFilters())}
            >
              Clear filters
            </button>
          </div>
        </div>
      </section>

      <section className="results-panel">
        <div className="results-header">
          <h2>
            {recipeState.query
              ? `Search results for “${recipeState.query}”`
              : `${recipeState.mood ? `Mood: ${recipeState.mood}` : "Recommendations"}`}
          </h2>
          {recipeState.status === "loading" && (
            <p className="status-text">Loading recipes…</p>
          )}
          {recipeState.error && (
            <p className="status-text error">{recipeState.error}</p>
          )}
        </div>

        <div className="results-grid">
          {recipes.length === 0 ? (
            <div className="empty-state">
              <p>
                No recipes match your current filters. Try another mood or clear
                filters.
              </p>
            </div>
          ) : (
            recipes.map((recipe) => (
              <RecipeCard key={recipe.id} recipe={recipe} />
            ))
          )}
        </div>
      </section>
    </main>
  );
}
