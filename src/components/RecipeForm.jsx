import { useEffect, useState } from "react";

const defaultRecipe = {
  title: "",
  description: "",
  tags: "",
  mealType: "",
  cookTime: "",
  notes: "",
  rating: 0,
};

const normalizeRecipe = (recipe) => ({
  ...defaultRecipe,
  ...recipe,
  tags: Array.isArray(recipe.tags) ? recipe.tags.join(", ") : recipe.tags || "",
});

export default function RecipeForm({ initialRecipe = {}, onSave, onCancel }) {
  const [recipe, setRecipe] = useState(normalizeRecipe(initialRecipe));

  useEffect(() => {
    setRecipe(normalizeRecipe(initialRecipe));
  }, [initialRecipe]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setRecipe((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const payload = {
      title: recipe.title.trim(),
      description: recipe.description.trim(),
      tags: recipe.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean),
      mealType: recipe.mealType.trim(),
      cookTime: recipe.cookTime.trim(),
      notes: recipe.notes.trim(),
      rating: Number(recipe.rating) || 0,
      addedAt: new Date().toISOString(),
    };
    if (!payload.title) return;
    onSave(payload);
  };

  return (
    <form
      className="space-y-6 bg-white p-6 rounded-3xl shadow-sm border border-stone-200"
      onSubmit={handleSubmit}
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="text-sm font-semibold">Recipe title</span>
          <input
            name="title"
            value={recipe.title}
            onChange={handleChange}
            className="mt-1 block w-full rounded-xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm text-stone-900 outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-100"
            placeholder="e.g. Veggie Curry"
          />
        </label>

        <label className="block">
          <span className="text-sm font-semibold">Category / meal type</span>
          <input
            name="mealType"
            value={recipe.mealType}
            onChange={handleChange}
            className="mt-1 block w-full rounded-xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm text-stone-900 outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-100"
            placeholder="e.g. Dinner"
          />
        </label>

        <label className="block">
          <span className="text-sm font-semibold">Cook time</span>
          <input
            name="cookTime"
            value={recipe.cookTime}
            onChange={handleChange}
            className="mt-1 block w-full rounded-xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm text-stone-900 outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-100"
            placeholder="e.g. 30 mins"
          />
        </label>

        <label className="block">
          <span className="text-sm font-semibold">Tags</span>
          <input
            name="tags"
            value={recipe.tags}
            onChange={handleChange}
            className="mt-1 block w-full rounded-xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm text-stone-900 outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-100"
            placeholder="Enter tags separated by commas"
          />
        </label>
      </div>

      <label className="block">
        <span className="text-sm font-semibold">Description</span>
        <textarea
          name="description"
          value={recipe.description}
          onChange={handleChange}
          rows={3}
          className="mt-1 block w-full rounded-3xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm text-stone-900 outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-100"
          placeholder="Write a short summary of the recipe."
        />
      </label>

      <label className="block">
        <span className="text-sm font-semibold">Notes</span>
        <textarea
          name="notes"
          value={recipe.notes}
          onChange={handleChange}
          rows={3}
          className="mt-1 block w-full rounded-3xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm text-stone-900 outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-100"
          placeholder="Personal notes or cooking tips."
        />
      </label>

      <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
        {onCancel && (
          <button
            type="button"
            className="secondary w-full rounded-full px-5 py-3 text-sm font-semibold sm:w-auto"
            onClick={onCancel}
          >
            Cancel
          </button>
        )}
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
