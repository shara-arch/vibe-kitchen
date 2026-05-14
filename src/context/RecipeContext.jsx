import { createContext, useMemo, useState } from "react";

export const RecipeContext = createContext(null);

const initialRecipes = [
    {
        id: "r-1",
        title: "Citrus Chickpea Bowl",
        description: "Chickpeas, roasted carrots, and lemon tahini over quinoa.",
        tags: ["vegan", "high-protein"],
    },
    {
        id: "r-2",
        title: "Smoky Tomato Pasta",
        description: "Roasted tomato sauce with basil and toasted breadcrumbs.",
        tags: ["vegetarian", "comfort"],
    },
    {
        id: "r-3",
        title: "Ginger Salmon Rice",
        description: "Pan-seared salmon with ginger soy glaze and steamed greens.",
        tags: ["pescatarian", "weeknight"],
    },
    {
        id: "r-4",
        title: "Morning Oat Pancakes",
        description: "Blended oat pancakes topped with fruit and yogurt.",
        tags: ["breakfast", "quick"],
    },
];

export function RecipeProvider({ children }) {
    const [recipes, setRecipes] = useState(initialRecipes);
    const [myRecipes, setMyRecipes] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");

    const filteredRecipes = useMemo(() => {
        const query = searchQuery.trim().toLowerCase();
        if (!query) return recipes;

        return recipes.filter((recipe) => {
            const inTitle = recipe.title.toLowerCase().includes(query);
            const inDescription = recipe.description.toLowerCase().includes(query);
            const inTags = recipe.tags.join(" ").toLowerCase().includes(query);
            return inTitle || inDescription || inTags;
        });
    }, [recipes, searchQuery]);

    const addRecipe = (recipeInput) => {
        const newRecipe = {
            id: `r-${Date.now()}`,
            title: recipeInput.title.trim(),
            description: recipeInput.description.trim(),
            tags: recipeInput.tags
                .split(",")
                .map((tag) => tag.trim())
                .filter(Boolean),
            mealType: recipeInput.mealType || "",
            cookTime: recipeInput.cookTime?.trim() || "",
            notes: recipeInput.notes?.trim() || "",
            rating: recipeInput.rating || 0,
            addedAt: new Date().toISOString(),
        };

        setRecipes((prev) => [newRecipe, ...prev]);
        setMyRecipes((prev) => [newRecipe, ...prev]);
    };

    const saveRecipeToMine = (recipeId) => {
        const target = recipes.find((recipe) => recipe.id === recipeId);
        if (!target) return;

        setMyRecipes((prev) => {
            if (prev.some((recipe) => recipe.id === target.id)) return prev;
            return [target, ...prev];
        });
    };

    const removeMyRecipe = (recipeId) => {
        setMyRecipes((prev) => prev.filter((recipe) => recipe.id !== recipeId));
    };

    const updateMyRecipe = (recipeId, changes) => {
        setMyRecipes((prev) =>
            prev.map((recipe) =>
                recipe.id === recipeId ? { ...recipe, ...changes } : recipe
            )
        );
    };

    return (
        <RecipeContext.Provider
            value={{
                recipes,
                myRecipes,
                searchQuery,
                filteredRecipes,
                setSearchQuery,
                addRecipe,
                saveRecipeToMine,
                removeMyRecipe,
                updateMyRecipe,
            }}
        >
            {children}
        </RecipeContext.Provider>
    );
}