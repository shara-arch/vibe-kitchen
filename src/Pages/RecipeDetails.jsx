import { useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchRecipeById,
  clearSelectedRecipe,
} from "../features/recipes/recipesSlice";

export default function RecipeDetail() {
  // Get recipe id from the URL
  const { id } = useParams();
  const dispatch = useDispatch();

  // Read recipe data from Redux store
  const recipe = useSelector((state) => state.recipes.selectedRecipe);
  const status = useSelector((state) => state.recipes.status);

  // Fetch the recipe when page loads
  useEffect(() => {
    dispatch(fetchRecipeById(id));
    return () => {
      dispatch(clearSelectedRecipe());
    };
  }, [id]);

  // Show loading while fetching
  if (status === "loading" || !recipe) {
    return (
      <main className="page-shell">
        <p className="status-text">Loading recipe...</p>
      </main>
    );
  }

  // Build ingredients list from strIngredient and strMeasure properties
  const ingredients = [];
  if (recipe) {
    for (let i = 1; i <= 20; i++) {
      const ingredient = recipe[`strIngredient${i}`];
      const measure = recipe[`strMeasure${i}`];
      if (ingredient && ingredient.trim()) {
        ingredients.push(`${measure} ${ingredient}`.trim());
      }
    }
  }

  return (
    <main className="page-shell detail-shell">
      <section className="detail-panel">
        <Link to="/">← Back to recipes</Link>

        <h1>{recipe.strMeal}</h1>
        <p>
          {recipe.strCategory || "Meal"} • {recipe.strArea || "International"}
        </p>

        <img src={recipe.strMealThumb} alt={recipe.strMeal} />

        <h2>Ingredients</h2>
        <ul>
          {ingredients.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>

        <h2>Instructions</h2>
        <p>{recipe.strInstructions || "No instructions available."}</p>

        {recipe.strYoutube && (
          <div>
            <h2>Video Tutorial</h2>
            <a
              href={recipe.strYoutube}
              target="_blank"
              rel="noopener noreferrer"
              className="text-amber-600 hover:text-amber-700"
            >
              Watch on YouTube
            </a>
          </div>
        )}

        {recipe.strSource && (
          <div>
            <h2>Original Recipe</h2>
            <a
              href={recipe.strSource}
              target="_blank"
              rel="noopener noreferrer"
              className="text-amber-600 hover:text-amber-700"
            >
              View source
            </a>
          </div>
        )}
      </section>
    </main>
  );
}
