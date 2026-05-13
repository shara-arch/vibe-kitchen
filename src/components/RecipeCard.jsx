import {Clock, Users} from 'lucide-react';

                        
{/* NOTE:Card Render may not occur due to variable name  mismatch */}

export default function RecipeCard({meal}) {
    return(
        <div className="group bg-white rounded-2xl overflow-hidden border border-stone-200 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer">
            <div className='relative overflow-hidden aspect-[4/3]'>
                <img src={meal.strMealThumb} alt={meal.MealName} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="p-4">
                    <h3 className='font-semibold text-stone-800 text-sm leading-snug mb-2 line-clamp-2 group-hover:text-amber-600 transition-colors'>
                        {meal.MealName}</h3>
                    <div className='flex flex-wrap gap-1.5 mb-3'>
                        {/* Displays the category of meals ie beef, vegeterian, vegan */}
                        {/* NOTE:Card Render may not occur due to variable mismatch */}
                        {meal.MealCategory && (
                            <span className="px-2 py-0.5 bg-amber-100 text-amber-700 text-[10px] font-semibold rounded-full">
                                {meal.MealCategory}</span>
                        )} 
                        {/* Displays the Country of Origin the meal is from i.e Italian, Kenyan, American */}
                        {meal.mealOrigin && (
                            <span className="px-2 py-0.5 bg-stone-100 text-stone-600 text-[10px] font-semibold rounded-full">
                                {meal.mealOrigin}</span>
                        )}
                    </div>
                    <div className='flex items-center gap-3 text-[11px] text-stone-400'>
                        <span className='flex items-center gap-1'> <Clock size={11}/>30-45 min</span>
                        <span className='flex items-center gap-1'><Users size={11}/>4 Servings</span>
                    </div>
                </div>
            </div>
        </div>
    )
}