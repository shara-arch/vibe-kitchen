import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Clock, Users, ChefHat, Play } from 'lucide-react';
import { useRecipes } from '../hooks/useRecipes.js';

function extractIngredients(meal) {
  const result = [];
  for (let i = 1; i <= 20; i++) {
    const ingredient = meal[`strIngredient${i}`];
    const measure = meal[`strMeasure${i}`];
    if (ingredient && ingredient.trim()) {
      result.push(`${measure?.trim() ?? ''} ${ingredient.trim()}`.trim());
    }
  }
  return result;
}

export default function RecipeDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { fetchById, loading } = useRecipes();
  const [meal, setMeal] = useState(null);

  useEffect(() => {
    if (id) fetchById(id).then(setMeal);
  }, [id, fetchById]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-8 h-8 border-3 border-amber-500 border-t-transparent rounded-full animate-spin" />
        <span className="ml-3 text-stone-500 text-sm">Loading recipe...</span>
      </div>
    );
  }

  if (!meal) {
    return (
      <div className="text-center py-20">
        <ChefHat size={48} className="text-stone-300 mx-auto mb-4" />
        <p className="text-stone-500 font-medium">Recipe not found.</p>
        <button onClick={() => navigate(-1)} className="mt-4 text-amber-600 text-sm hover:underline">
          Go back
        </button>
      </div>
    );
  }

  const ingredients = extractIngredients(meal);
  const instructions = meal.strInstructions
    ?.split(/\r\n|\n/)
    .map(s => s.trim())
    .filter(Boolean) || [];

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-stone-500 hover:text-stone-800 mb-6 text-sm font-medium transition-colors group"
      >
        <ArrowLeft size={16} className="group-hover:-translate-x-0.5 transition-transform" />
        Back to results
      </button>

      <div className="bg-white rounded-2xl overflow-hidden border border-stone-200 shadow-sm">
        <div className="relative">
          <img
            src={meal.strMealThumb}
            alt={meal.strMeal}
            className="w-full h-72 sm:h-96 object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-6">
            <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">{meal.strMeal}</h1>
            <div className="flex flex-wrap gap-2">
              {meal.strCategory && (
                <span className="px-3 py-1 bg-amber-500 text-white text-xs font-semibold rounded-full">
                  {meal.strCategory}
                </span>
              )}
              {meal.strArea && (
                <span className="px-3 py-1 bg-white/20 backdrop-blur-sm text-white text-xs font-semibold rounded-full">
                  {meal.strArea}
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="p-6">
          <div className="flex items-center gap-6 pb-5 mb-6 border-b border-stone-100">
            <div className="flex items-center gap-2 text-stone-600 text-sm">
              <Clock size={16} className="text-amber-500" />
              <span>30-45 min</span>
            </div>
            <div className="flex items-center gap-2 text-stone-600 text-sm">
              <Users size={16} className="text-amber-500" />
              <span>4 servings</span>
            </div>
            <div className="flex items-center gap-2 text-stone-600 text-sm">
              <ChefHat size={16} className="text-amber-500" />
              <span>Medium difficulty</span>
            </div>
          </div>

          <div className="grid sm:grid-cols-5 gap-8">
            <div className="sm:col-span-2">
              <h2 className="text-lg font-bold text-stone-800 mb-4">Ingredients</h2>
              <ul className="space-y-2">
                {ingredients.map((ing, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-sm text-stone-600">
                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0" />
                    {ing}
                  </li>
                ))}
              </ul>
            </div>

            <div className="sm:col-span-3">
              <h2 className="text-lg font-bold text-stone-800 mb-4">Instructions</h2>
              <ol className="space-y-4">
                {instructions.map((step, i) => (
                  <li key={i} className="flex gap-3">
                    <span className="shrink-0 w-6 h-6 rounded-full bg-amber-100 text-amber-700 text-xs font-bold flex items-center justify-center mt-0.5">
                      {i + 1}
                    </span>
                    <p className="text-sm text-stone-600 leading-relaxed">{step}</p>
                  </li>
                ))}
              </ol>
            </div>
          </div>

          {meal.strYoutube && (
            <div className="mt-8 pt-6 border-t border-stone-100">
              <a
                href={meal.strYoutube}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-5 py-3 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-sm font-semibold transition-colors shadow-sm"
              >
                <Play size={16} fill="white" />
                Watch Video Tutorial
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}