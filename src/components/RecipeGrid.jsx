import { ChefHat } from "lucide-react";
import RecipeCard from './RecipeCard.jsx';

export default function RecipeGrid({meals}) {

    
    if(!meals.length){
        return(
            <div className="">
                <ChefHat size={48} className="text-center py-20" />
                <p className="text-stone-500 font-medium mb-1">No recipes yet</p>
                <p className="text-stone-400 text-sm">Select a mood or search for a recipe to get started</p>
            </div>
        )
    }
    return(
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
      {meals.map(meal => (
        <RecipeCard key={meal.idMeal} meal={meal} />
      ))}
    </div>
    )
}