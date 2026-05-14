import { useState } from "react";

export default function RecipeForm({ initialRecipe = {}, onSave, onCancel }) {
  const [title, setTitle] = useState(initialRecipe.title || "");
  const [category, setCategory] = useState(initialRecipe.category || "");
  const [image, setImage] = useState(initialRecipe.image || "");
  const [ingredients, setIngredients] = useState(
    initialRecipe.ingredients ? initialRecipe.ingredients.join("\n") : "",
  );
  const [instructions, setInstructions] = useState(
    initialRecipe.instructions || "",
  );
  const [dietLabels, setDietLabels] = useState(initialRecipe.dietLabels || "");
  const [allergies, setAllergies] = useState(initialRecipe.allergies || "");
  const [healthNotes, setHealthNotes] = useState(
    initialRecipe.healthNotes || "",
  );

  const handleSubmit = (event) => {
    event.preventDefault();
    onSave({
      ...initialRecipe,
      title: title.trim(),
      category: category.trim(),
      image: image.trim(),
      ingredients: ingredients
        .split("\n")
        .map((line) => line.trim())
        .filter(Boolean),
      instructions: instructions.trim(),
      dietLabels: dietLabels
        .split(",")
        .map((label) => label.trim())
        .filter(Boolean),
      allergies: allergies
        .split(",")
        .map((label) => label.trim())
        .filter(Boolean),
      healthNotes: healthNotes.trim(),
    });
  };

  return (
    <form className="recipe-form" onSubmit={handleSubmit}>
      <div className="form-row">
        <label>
          Recipe name
          <input
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="Avocado salad"
          />
        </label>
        <label>
          Category
          <input
            value={category}
            onChange={(event) => setCategory(event.target.value)}
            placeholder="Salad"
          />
        </label>
      </div>

      <label>
        Image URL
        <input
          value={image}
          onChange={(event) => setImage(event.target.value)}
          placeholder="https://..."
        />
      </label>

      <label>
        Ingredients (one per line)
        <textarea
          value={ingredients}
          onChange={(event) => setIngredients(event.target.value)}
          rows="5"
        />
      </label>

      <label>
        Instructions
        <textarea
          value={instructions}
          onChange={(event) => setInstructions(event.target.value)}
          rows="5"
        />
      </label>

      <div className="form-row">
        <label>
          Diet labels
          <input
            value={dietLabels}
            onChange={(event) => setDietLabels(event.target.value)}
            placeholder="high protein, low carbs"
          />
        </label>
        <label>
          Allergies
          <input
            value={allergies}
            onChange={(event) => setAllergies(event.target.value)}
            placeholder="nuts, gluten"
          />
        </label>
      </div>

      <label>
        Health notes
        <textarea
          value={healthNotes}
          onChange={(event) => setHealthNotes(event.target.value)}
          rows="3"
          placeholder="Heart friendly, diabetes-friendly"
        />
      </label>

      <div className="form-actions">
        <button type="button" className="secondary" onClick={onCancel}>
          Cancel
        </button>
        <button type="submit">Save recipe</button>
      </div>
    </form>
  );
}
