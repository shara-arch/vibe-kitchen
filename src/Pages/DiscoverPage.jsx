import { useState, useEffect } from 'react';
import { SlidersHorizontal } from 'lucide-react';
import MoodSelector from '../components/MoodSelector.jsx';
import SearchBar from '../components/SearchBar.jsx';
import FilterPanel from '../components/FilterPanel.jsx';
import RecipeGrid from '../components/RecipeGrid.jsx';
import About from '../components/About.jsx';

export default function DiscoverPage() {
  const [selectedMood, setSelectedMood] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [activeFilters, setActiveFilters] = useState([]);
  const [meals, setMeals] = useState([]);
  const [loading, setLoading] = useState (true);

  useEffect(() => {
    async function fetchMeals(){
      try{
        const categories = ['Chicken', 'Seafood', 'Vegetarian', 'Beef', 'Pasta']

        //fetch meal list for each category
        const results = await Promise.all(
          categories.map(cat => 
            fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${cat}`)
              .then(res => res.json())
          )
        )
        console.log("Results: ", results)

        //Grab 10 meals per category and flatten(removes 1 level of nesting from an array) to 1 array
        const mealIds = results.map(r => r.meals.slice(0, 10)).flat()
        console.log("Meal Ids: ",mealIds)

        //fetch full details of each meal
        const detailed = await Promise.all(
          mealIds.map(meal => 
            fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${meal.idMeal}`)
              .then(res => res.json()) //the response for each meal comes in array format
              .then(d => d.meals?.[0] ?? null) //makes sure to display the first and only index in each response meal array
          )
        )
        console.log("Detailed result: ", detailed)

        setMeals(detailed)
      }catch(err){
        console.error("Error message: ",err)
      } finally{
        setLoading(false)
      }
    }
    fetchMeals()
  }, []);

  //mood selection filter
  async function handleMoodSelected(moodName, moodCategories ){
    setSelectedMood(moodName);
    setLoading(true);

    try{
      //fetch meals by category
      const results = await Promise.all(
          moodCategories.map(cat => 
            fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${cat}`)
              .then(res => res.json())
          )
        )

        const mealIds = results
        .filter(r => r.meals !== null) //filters out any categories that return no meals
        .map(r => r.meals.slice(0, 10)).flat()

        //fetch full details of each meal by id
        const detailed = await Promise.all(
          mealIds.map(meal => 
            fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${meal.idMeal}`)
              .then(res => res.json()) //the response for each meal comes in array format
              .then(d => d.meals?.[0] ?? null) //makes sure to display the first and only index in each response meal array
          )
        )

        setMeals(detailed.filter(meal => meal !== null)) //only set meals that have details, filters out any null values that may occur if a meal lookup fails
      
      }catch(err){
        console.error("Error message: ",err)
      } finally{
        setLoading(false)
      }
  }

  //handles filtering of meals based on active filters selected in the filter panel
    function hasIngredient(meal, ingredient) {
      for (let i = 1; i <= 20; i++) {
        const ing = meal[`strIngredient${i}`]
        if (ing && ing.toLowerCase().includes(ingredient.toLowerCase())) {
          return true
        }
      }
      return false
    }
    
    const filteredMeals = activeFilters.length
    ? meals.filter(meal => {
      //meal is kept only if every filter is passed, if even 1 filter fails the meal is removed from the list
      return activeFilters.every(filter => {
        if (filter === 'Vegetarian') return meal.strCategory === 'Vegetarian'
        if (filter === 'Vegan') return meal.strCategory === 'Vegan'
        //checking for high protein by looking for common high protein ingredients, this is not a perfect method but the meal db api does not provide nutritional info to be more accurate
        if (filter === 'High Protein') {
          const result = hasIngredient(meal, 'chicken') || hasIngredient(meal, 'beef') || hasIngredient(meal, 'egg')
            console.log("Checking meal: ", meal.strMeal, " for high protein. Result: ", result)
            return result
          }
        if (filter === 'No Nuts') return !hasIngredient(meal, 'nuts') && !hasIngredient(meal, 'almond') && !hasIngredient(meal, 'peanut')
        if (filter === 'No Dairy') return !hasIngredient(meal, 'cheese') && !hasIngredient(meal, 'milk') && !hasIngredient(meal, 'butter')
        if (filter === 'No Eggs') return !hasIngredient(meal, 'egg')
        if (filter === 'No Soy') return !hasIngredient(meal, 'soy')
        if (filter === 'No Fish') return !hasIngredient(meal, 'fish') && !hasIngredient(meal, 'salmon') && !hasIngredient(meal, 'tuna')
        return true
      })
    })
  : meals
console.log("Filtered meals: ", filteredMeals)

  return(
    <main className='max-w-6xl mx-auto px-4 py-8'>
        <About />
        <MoodSelector selectedMood={selectedMood} onMoodSelect={handleMoodSelected} />
        <SearchBar value={searchQuery} onChange={setSearchQuery}/>
        <div className='flex items-center justify-between mb-4'>
            {filteredMeals.length > 0 && (
                <p className="text-sm text-stone-500">
                    Showing <span className="font-semibold text-stone-700">{filteredMeals.length}</span> recipes
                    {selectedMood && <span> for <span className="font-semibold text-amber-600">{selectedMood}</span></span>}
                </p>
            )}
            <button onClick={() => setShowFilters(!showFilters)} className={`ml-auto flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium border transition-all ${
                 showFilters || activeFilters.length > 0
                ? 'bg-amber-500 border-amber-500 text-white'
                : 'bg-white border-stone-200 text-stone-600 hover:border-amber-400 hover:text-amber-600'
                }`}> <SlidersHorizontal size={15}/> Filters
            {activeFilters.length > 0 && (
            <span className="bg-white/30 text-white text-xs rounded-full px-1.5">{activeFilters.length}</span>
          )}
          </button>
        </div>
        {showFilters && (
        <FilterPanel activeFilters={activeFilters} onFilterChange={setActiveFilters} />
      )}
      { loading ? <p>Loading meals...</p> 
      : <RecipeGrid meals={filteredMeals} />
      }
      
    </main>
  )
}