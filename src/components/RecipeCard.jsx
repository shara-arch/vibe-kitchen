import { Link } from "react-router-dom";

export default function RecipeCard({ recipe }) {
  return (
    <article className="recipe-card">
      <img src={recipe.image} alt={recipe.title} />
      <div className="recipe-card-body">
        <div>
          <h3>{recipe.title}</h3>
          <p>{recipe.category || recipe.area || "Recipe"}</p>
        </div>
        <Link to={`/recipes/${recipe.id}`} className="recipe-card-link">
          View details
        </Link>
      </div>
    </article>
  );
}

