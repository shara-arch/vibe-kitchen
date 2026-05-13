import {Clock, Users} from 'lucide-react';

                        
{/* NOTE:Card Render may not occur due to variable name  mismatch */}

export default function RecipeCard({meal}) {
    return(
        <div className="">
            <div className=''>
                <img src={} alt={} className="" />
                <div>
                    <h3>{meal.MealName}</h3>
                    <div>
                        {/* Displays the category of meals ie beef, vegeterian, vegan */}
                        {/* NOTE:Card Render may not occur due to variable mismatch */}
                        {meal.MealCategory && (
                            <span>{meal.MealCategory}</span>
                        )} 
                        {/* Displays the Country of Origin the meal is from i.e Italian, Kenyan, American */}
                        {meal.mealOrigin && (
                            <span>{meal.mealOrigin}</span>
                        )}
                    </div>
                    <div className=''>
                        <span className=''> <Clock size={11}/>30-45 min</span>
                        <span className=''><Users size={11}/>4 Servings</span>
                    </div>
                </div>
            </div>
        </div>
    )
}