import { useState } from "react";

const MEAL_TYPES = ["Breakfast", "Lunch", "Dinner", "Snack", "Dessert", "Drink"];

const initialForm = {
    title: "",
    description: "",
    tags: "",
    mealType: "",
    cookTime: "",
    notes: "",
    rating: 0,
};

export default function RecipeForm({ onSubmit }) {
    const [form, setForm] = useState(initialForm);

    const handleChange = (event) => {
        const { name, value } = event.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleRating = (value) => {
        setForm((prev) => ({ ...prev, rating: value }));
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        if (!form.title.trim() || !form.description.trim()) return;
        onSubmit(form);
        setForm(initialForm);
    };

    return (
        <form className="recipe-form" onSubmit={handleSubmit}>
            <h2>Add Your Recipe</h2>

            <div className="form-row">
                <label className="form-field">
                    Recipe Title <span className="required">*</span>
                    <input
                        name="title"
                        value={form.title}
                        onChange={handleChange}
                        placeholder="Ex: Roasted Veggie Pasta"
                        required
                    />
                </label>

                <label className="form-field">
                    Meal Type
                    <select name="mealType" value={form.mealType} onChange={handleChange}>
                        <option value="">Select…</option>
                        {MEAL_TYPES.map((type) => (
                            <option key={type} value={type}>{type}</option>
                        ))}
                    </select>
                </label>
            </div>

            <label className="form-field">
                Description <span className="required">*</span>
                <textarea
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    placeholder="Short details about ingredients and style"
                    rows={3}
                    required
                />
            </label>

            <div className="form-row">
                <label className="form-field">
                    Tags
                    <input
                        name="tags"
                        value={form.tags}
                        onChange={handleChange}
                        placeholder="quick, vegetarian, weeknight"
                    />
                </label>

                <label className="form-field">
                    Cook Time
                    <input
                        name="cookTime"
                        value={form.cookTime}
                        onChange={handleChange}
                        placeholder="Ex: 30 min"
                    />
                </label>
            </div>

            <label className="form-field">
                Personal Notes
                <textarea
                    name="notes"
                    value={form.notes}
                    onChange={handleChange}
                    placeholder="Tips, substitutions, or memories about this recipe…"
                    rows={2}
                />
            </label>

            <div className="form-field">
                <span className="rating-label">Your Rating</span>
                <div className="star-picker" role="group" aria-label="Rate this recipe">
                    {[1, 2, 3, 4, 5].map((star) => (
                        <button
                            key={star}
                            type="button"
                            className={`star-btn${form.rating >= star ? " star-btn--filled" : ""}`}
                            onClick={() => handleRating(star)}
                            aria-label={`${star} star${star > 1 ? "s" : ""}`}
                        >
                            ★
                        </button>
                    ))}
                </div>
            </div>

            <button type="submit" className="form-submit">
                Save Recipe
            </button>
        </form>
    );
}
