import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchRecipeById,
  clearSelectedRecipe,
  addUserRecipe,
} from "../features/recipes/recipesSlice";

export default function RecipeDetail() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const recipe = useSelector((state) => state.recipes.selectedRecipe);
  const status = useSelector((state) => state.recipes.status);
  const error = useSelector((state) => state.recipes.error);

  useEffect(() => {
    dispatch(fetchRecipeById(id));
    return () => {
      dispatch(clearSelectedRecipe());
    };
  }, [dispatch, id]);

  if (status === "loading" || !recipe) {
    return (
      <main className="page-shell">
        <section className="results-panel">
          <p className="status-text">Loading recipe details…</p>
        </section>
      </main>
    );
  }

  if (error) {
    return (
      <main className="page-shell">
        <section className="results-panel">
          <p className="status-text error">{error}</p>
        </section>
      </main>
    );
  }

  return (
    <main className="page-shell detail-shell">
      <section className="detail-panel">
        <div className="detail-header">
          <div>
            <p className="eyebrow">Recipe details</p>
            <h1>{recipe.title}</h1>
            <p className="meta">
              {recipe.category || recipe.area || "Meal"} •{" "}
              {recipe.tags?.join(", ") || "No tags"}
            </p>
          </div>
          <Link className="secondary" to="/">
            Back to discovery
          </Link>
        </div>

        <div className="detail-grid">
          <div className="detail-image">
            <img src={recipe.image} alt={recipe.title} />
          </div>

          <div className="detail-body">
            <div className="detail-block">
              <h2>Ingredients</h2>
              <ul>
                {(recipe.ingredients || []).map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </div>

            <div className="detail-block">
              <h2>Instructions</h2>
              <p>
                {recipe.instructions ||
                  "Instructions are not available for this recipe."}
              </p>
            </div>

            {recipe.healthNotes && (
              <div className="detail-block">
                <h2>Health notes</h2>
                <p>{recipe.healthNotes}</p>
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
