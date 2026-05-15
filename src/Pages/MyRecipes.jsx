import { useMemo, useState } from "react";
import RecipeForm from "../components/RecipeForm";
import { useRecipes } from "../hooks/useRecipes";

const STAR = "★";
const EMPTY_STAR = "☆";

function StarDisplay({ rating }) {
  return (
    <span className="star-display" aria-label={`${rating} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((s) => (
        <span key={s} className={s <= rating ? "star--filled" : "star--empty"}>
          {s <= rating ? STAR : EMPTY_STAR}
        </span>
      ))}
    </span>
  );
}

function PersonalRecipeCard({ recipe, onRemove, onUpdate }) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState({
    notes: recipe.notes || "",
    rating: recipe.rating || 0,
  });

  const handleSave = () => {
    onUpdate(recipe.id, draft);
    setEditing(false);
  };

  return (
    <article className="recipe-card personal-card">
      <div className="card-top">
        {recipe.mealType && (
          <span className="meal-badge">{recipe.mealType}</span>
        )}
        {recipe.cookTime && (
          <span className="cook-time">⏱ {recipe.cookTime}</span>
        )}
      </div>

      <h3>{recipe.title}</h3>
      <p>{recipe.description}</p>

      {recipe.tags?.length > 0 && (
        <div className="tag-row">
          {recipe.tags.map((tag) => (
            <span key={`${recipe.id}-${tag}`} className="tag-pill">
              {tag}
            </span>
          ))}
        </div>
      )}

      {!editing && (
        <div className="card-meta">
          <StarDisplay rating={recipe.rating || 0} />
          {recipe.notes && <p className="personal-notes">📝 {recipe.notes}</p>}
        </div>
      )}

      {editing && (
        <div className="inline-editor">
          <div className="form-field">
            <span className="rating-label">Rating</span>
            <div className="star-picker" role="group">
              {[1, 2, 3, 4, 5].map((s) => (
                <button
                  key={s}
                  type="button"
                  className={`star-btn${draft.rating >= s ? " star-btn--filled" : ""}`}
                  onClick={() => setDraft((d) => ({ ...d, rating: s }))}
                  aria-label={`${s} star${s > 1 ? "s" : ""}`}
                >
                  ★
                </button>
              ))}
            </div>
          </div>
          <label className="form-field">
            Notes
            <textarea
              value={draft.notes}
              onChange={(e) =>
                setDraft((d) => ({ ...d, notes: e.target.value }))
              }
              rows={2}
              placeholder="Add personal notes…"
            />
          </label>
          <div className="inline-editor-actions">
            <button type="button" className="btn-save" onClick={handleSave}>
              Save
            </button>
            <button
              type="button"
              className="btn-cancel"
              onClick={() => setEditing(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="card-actions">
        <button
          type="button"
          className="card-action card-action--secondary"
          onClick={() => {
            setDraft({ notes: recipe.notes || "", rating: recipe.rating || 0 });
            setEditing((e) => !e);
          }}
        >
          {editing ? "Close" : "Edit Notes"}
        </button>
        <button
          type="button"
          className="card-action card-action--danger"
          onClick={() => onRemove(recipe.id)}
        >
          Remove
        </button>
      </div>
    </article>
  );
}

const SORT_OPTIONS = [
  { value: "newest", label: "Newest first" },
  { value: "rating", label: "Highest rated" },
  { value: "alpha", label: "A → Z" },
];

export default function MyRecipes() {
  const { myRecipes, addRecipe, removeMyRecipe, updateMyRecipe } = useRecipes();
  const [mealFilter, setMealFilter] = useState("All");
  const [sortBy, setSortBy] = useState("newest");

  const mealTypes = useMemo(() => {
    const types = myRecipes.map((r) => r.mealType).filter(Boolean);
    return ["All", ...new Set(types)];
  }, [myRecipes]);

  const displayedRecipes = useMemo(() => {
    let list =
      mealFilter === "All"
        ? myRecipes
        : myRecipes.filter((r) => r.mealType === mealFilter);

    if (sortBy === "rating")
      list = [...list].sort((a, b) => (b.rating || 0) - (a.rating || 0));
    else if (sortBy === "alpha")
      list = [...list].sort((a, b) => a.title.localeCompare(b.title));

    return list;
  }, [myRecipes, mealFilter, sortBy]);

  const avgRating = useMemo(() => {
    const rated = myRecipes.filter((r) => r.rating > 0);
    if (!rated.length) return null;
    return (rated.reduce((sum, r) => sum + r.rating, 0) / rated.length).toFixed(
      1,
    );
  }, [myRecipes]);

  return (
    <section className="page-stack">
      <RecipeForm onSave={addRecipe} />

      <div className="my-recipes-section">
        <div className="section-header">
          <h2 className="section-title">My Recipes</h2>
          <div className="stats-bar">
            <span className="stat-chip">{myRecipes.length} saved</span>
            {avgRating && <span className="stat-chip">⭐ avg {avgRating}</span>}
          </div>
        </div>

        {myRecipes.length > 0 && (
          <div className="filter-bar">
            <div className="filter-group">
              {mealTypes.map((type) => (
                <button
                  key={type}
                  type="button"
                  className={`filter-chip${mealFilter === type ? " filter-chip--active" : ""}`}
                  onClick={() => setMealFilter(type)}
                >
                  {type}
                </button>
              ))}
            </div>
            <select
              className="sort-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              aria-label="Sort recipes"
            >
              {SORT_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        )}

        {displayedRecipes.length === 0 ? (
          <p className="empty-text">
            {myRecipes.length === 0
              ? "No saved recipes yet. Save one from Discover or add your own above."
              : "No recipes match this filter."}
          </p>
        ) : (
          <div className="recipe-grid">
            {displayedRecipes.map((recipe) => (
              <PersonalRecipeCard
                key={recipe.id}
                recipe={recipe}
                onRemove={removeMyRecipe}
                onUpdate={updateMyRecipe}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
