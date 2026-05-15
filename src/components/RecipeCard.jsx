import { Clock, Users } from "lucide-react";
import { Link } from "react-router-dom";

export default function RecipeCard({ meal, recipe }) {
  const item = meal ?? recipe ?? {};
  const recipeId = item.idMeal || item.id;

  return (
    <div className="group bg-white rounded-2xl overflow-hidden border border-stone-200 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer flex flex-col">
      <div className="relative overflow-hidden aspect-[4/3]">
        <img
          src={
            item.strMealThumb || item.image || "https://via.placeholder.com/400"
          }
          alt={item.strMeal || item.name || "Recipe image"}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
      </div>
      <div className="p-4 flex flex-col flex-grow">
        <h3 className="font-semibold text-stone-800 text-sm leading-snug mb-2 line-clamp-2 group-hover:text-amber-600 transition-colors">
          {item.strMeal || item.name || "Untitled recipe"}
        </h3>
        <div className="flex flex-wrap gap-1.5 mb-3">
          {item.strCategory && (
            <span className="px-2 py-0.5 bg-amber-100 text-amber-700 text-[10px] font-semibold rounded-full">
              {item.strCategory}
            </span>
          )}
          {item.strArea && (
            <span className="px-2 py-0.5 bg-stone-100 text-stone-600 text-[10px] font-semibold rounded-full">
              {item.strArea}
            </span>
          )}
        </div>
        {(item.strInstructions || item.description) && (
          <p className="text-xs text-stone-600 mb-3 line-clamp-2">
            {(item.strInstructions || item.description).substring(0, 100)}...
          </p>
        )}
        <div className="flex items-center gap-3 text-[11px] text-stone-400 mb-4">
          <span className="flex items-center gap-1">
            {" "}
            <Clock size={11} />
            30-45 min
          </span>
          <span className="flex items-center gap-1">
            <Users size={11} />4 Servings
          </span>
        </div>
        {recipeId && (
          <Link
            to={`/recipe/${recipeId}`}
            className="mt-auto w-full bg-amber-500 hover:bg-amber-600 text-white font-semibold py-2 px-4 rounded-lg text-sm transition-colors text-center"
          >
            View Details
          </Link>
        )}
      </div>
    </div>
  );
}
