import { useEffect, useState } from "react";

const defaultRecipe = {
  id: null,
  strMeal: "",
  strCategory: "",
  strArea: "",
  strInstructions: "",
  strMealThumb: "",
};

export default function RecipeForm({ initialRecipe = {}, onSave, onCancel }) {
  const [recipe, setRecipe] = useState({ ...defaultRecipe, ...initialRecipe });

  useEffect(() => {
    setRecipe({ ...defaultRecipe, ...initialRecipe });
  }, [initialRecipe]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setRecipe((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!recipe.strMeal.trim()) return;
    onSave(recipe);
  };

  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="text-sm font-semibold">Recipe name</span>
          <input
            name="strMeal"
            value={recipe.strMeal}
            onChange={handleChange}
            className="mt-1 block w-full rounded-xl border border-stone-200 bg-white px-4 py-3 text-sm text-stone-900 shadow-sm outline-none transition focus:border-amber-500 focus:ring-2 focus:ring-amber-100"
            placeholder="e.g. Veggie Curry"
          />
        </label>

        <label className="block">
          <span className="text-sm font-semibold">Category</span>
          <input
            name="strCategory"
            value={recipe.strCategory}
            onChange={handleChange}
            className="mt-1 block w-full rounded-xl border border-stone-200 bg-white px-4 py-3 text-sm text-stone-900 shadow-sm outline-none transition focus:border-amber-500 focus:ring-2 focus:ring-amber-100"
            placeholder="e.g. Vegetarian"
          />
        </label>

        <label className="block">
          <span className="text-sm font-semibold">Cuisine</span>
          <input
            name="strArea"
            value={recipe.strArea}
            onChange={handleChange}
            className="mt-1 block w-full rounded-xl border border-stone-200 bg-white px-4 py-3 text-sm text-stone-900 shadow-sm outline-none transition focus:border-amber-500 focus:ring-2 focus:ring-amber-100"
            placeholder="e.g. Indian"
          />
        </label>

        <label className="block">
          <span className="text-sm font-semibold">Image URL</span>
          <input
            name="strMealThumb"
            value={recipe.strMealThumb}
            onChange={handleChange}
            className="mt-1 block w-full rounded-xl border border-stone-200 bg-white px-4 py-3 text-sm text-stone-900 shadow-sm outline-none transition focus:border-amber-500 focus:ring-2 focus:ring-amber-100"
            placeholder="https://example.com/image.jpg"
          />
        </label>
      </div>

      <label className="block">
        <span className="text-sm font-semibold">Instructions</span>
        <textarea
          name="strInstructions"
          value={recipe.strInstructions}
          onChange={handleChange}
          rows={6}
          className="mt-1 block w-full rounded-3xl border border-stone-200 bg-white px-4 py-3 text-sm text-stone-900 shadow-sm outline-none transition focus:border-amber-500 focus:ring-2 focus:ring-amber-100"
          placeholder="Write the steps for preparing this recipe."
        />
      </label>

      <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
        <button
          type="button"
          className="secondary w-full rounded-full px-5 py-3 text-sm font-semibold sm:w-auto"
          onClick={onCancel}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="primary w-full rounded-full px-5 py-3 text-sm font-semibold sm:w-auto"
        >
          Save recipe
        </button>
      </div>
    </form>
  );
}
