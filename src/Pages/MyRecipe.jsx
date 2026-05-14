import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchUserRecipes,
  addUserRecipe,
  updateUserRecipe,
  deleteUserRecipe,
} from "../features/recipes/recipesSlice";
import RecipeForm from "../components/RecipeForm.jsx";
import RecipeCard from "../components/RecipeCard.jsx";

export default function MyRecipes() {
  const dispatch = useDispatch();
  const userRecipes = useSelector((state) => state.recipes.userRecipes);
  const [editingRecipe, setEditingRecipe] = useState(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    dispatch(fetchUserRecipes());
  }, [dispatch]);

  const handleSave = async (recipe) => {
    if (recipe.id) {
      await dispatch(updateUserRecipe(recipe));
    } else {
      await dispatch(addUserRecipe(recipe));
    }
    setShowForm(false);
    setEditingRecipe(null);
  };

  const handleEdit = (recipe) => {
    setEditingRecipe(recipe);
    setShowForm(true);
  };

  const handleDelete = (recipeId) => {
    dispatch(deleteUserRecipe(recipeId));
  };

  return (
    <main className="page-shell">
      <section className="hero-panel small">
        <div>
          <p className="eyebrow">Personal recipes</p>
          <h1>Your kitchen collection</h1>
          <p>
            Create, update and remove meals you want to keep handy for everyday
            cooking.
          </p>
        </div>
        <button
          className="primary"
          type="button"
          onClick={() => {
            setShowForm(true);
            setEditingRecipe(null);
          }}
        >
          Add recipe
        </button>
      </section>

      {showForm && (
        <section className="form-panel">
          <RecipeForm
            initialRecipe={editingRecipe || {}}
            onSave={handleSave}
            onCancel={() => {
              setShowForm(false);
              setEditingRecipe(null);
            }}
          />
        </section>
      )}

      <section className="results-panel">
        <div className="results-header">
          <h2>
            {userRecipes.length > 0
              ? "Saved recipes"
              : "No personalized recipes yet"}
          </h2>
          <p>
            Recipes you add here are stored locally and will be available as you
            build your vibe kitchen.
          </p>
        </div>

        <div className="results-grid">
          {userRecipes.length === 0 ? (
            <div className="empty-state">
              <p>Start by adding a new personalized recipe above.</p>
            </div>
          ) : (
            userRecipes.map((recipe) => (
              <div key={recipe.id} className="user-card">
                <RecipeCard recipe={recipe} />
                <div className="card-actions">
                  <button type="button" onClick={() => handleEdit(recipe)}>
                    Edit
                  </button>
                  <button
                    type="button"
                    className="secondary"
                    onClick={() => handleDelete(recipe.id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </section>
    </main>
  );
}
