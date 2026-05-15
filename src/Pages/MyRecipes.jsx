import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Plus, Pencil, Trash2, BookOpen } from "lucide-react";
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
    <main className="min-h-screen bg-stone-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-amber-50 via-white to-stone-50 border-b border-stone-200">
        <div className="max-w-6xl mx-auto px-4 py-12">
          <div className="flex items-start justify-between gap-8">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-amber-100 text-amber-600 p-3 rounded-xl">
                  <BookOpen size={24} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-amber-600 uppercase tracking-wide">
                    Personal recipes
                  </p>
                  <h1 className="text-4xl font-bold text-stone-900 mt-1">
                    Your kitchen collection
                  </h1>
                </div>
              </div>
              <p className="text-stone-600 max-w-lg">
                Create, update and remove meals you want to keep handy for
                everyday cooking. Build your perfect recipe library.
              </p>
            </div>
            <button
              className="flex items-center gap-2 px-6 py-3 bg-amber-500 hover:bg-amber-600 text-white font-semibold rounded-xl shadow-md hover:shadow-lg transition-all"
              type="button"
              onClick={() => {
                setShowForm(true);
                setEditingRecipe(null);
              }}
            >
              <Plus size={20} />
              Add recipe
            </button>
          </div>
        </div>
      </section>

      {/* Form Section */}
      {showForm && (
        <section className="border-b border-stone-200 bg-white">
          <div className="max-w-6xl mx-auto px-4 py-8">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-stone-900">
                {editingRecipe ? "Edit Recipe" : "Create New Recipe"}
              </h2>
              <p className="text-stone-500 mt-1">
                {editingRecipe
                  ? "Update your recipe details"
                  : "Add a new recipe to your collection"}
              </p>
            </div>
            <RecipeForm
              initialRecipe={editingRecipe || {}}
              onSave={handleSave}
              onCancel={() => {
                setShowForm(false);
                setEditingRecipe(null);
              }}
            />
          </div>
        </section>
      )}

      {/* Results Section */}
      <section className="max-w-6xl mx-auto px-4 py-12">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-stone-900 mb-2">
            {userRecipes.length > 0
              ? `Your Recipes (${userRecipes.length})`
              : "No personalized recipes yet"}
          </h2>
          <p className="text-stone-600">
            Recipes you add here are stored locally and will be available as you
            build your vibe kitchen.
          </p>
        </div>

        {userRecipes.length === 0 ? (
          <div className="text-center py-20 border-2 border-dashed border-stone-200 rounded-2xl">
            <BookOpen size={48} className="text-stone-300 mx-auto mb-4" />
            <p className="text-stone-600 font-medium mb-2">
              Start building your personal cookbook
            </p>
            <p className="text-stone-400 text-sm mb-8">
              Add your first recipe to get started
            </p>
            <button
              onClick={() => {
                setShowForm(true);
                setEditingRecipe(null);
              }}
              className="inline-flex items-center gap-2 px-6 py-3 bg-amber-500 hover:bg-amber-600 text-white font-semibold rounded-xl transition-colors"
            >
              <Plus size={20} />
              Add Your First Recipe
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {userRecipes.map((recipe) => (
              <div key={recipe.id} className="group">
                <div className="bg-white rounded-2xl overflow-hidden border border-stone-200 shadow-sm hover:shadow-md transition-all">
                  <RecipeCard recipe={recipe} />
                  <div className="p-4 border-t border-stone-100 flex gap-2">
                    <button
                      type="button"
                      onClick={() => handleEdit(recipe)}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-50 hover:bg-blue-100 text-blue-600 font-medium rounded-lg transition-colors border border-blue-200 hover:border-blue-300"
                    >
                      <Pencil size={16} />
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(recipe.id)}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-red-50 hover:bg-red-100 text-red-600 font-medium rounded-lg transition-colors border border-red-200 hover:border-red-300"
                    >
                      <Trash2 size={16} />
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
