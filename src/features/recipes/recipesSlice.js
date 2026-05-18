import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// ── localStorage helpers ──────────────────────────────────
const LS_MEALS_KEY = "vk_meals_cache";
const LS_MEALS_TS_KEY = "vk_meals_ts";
const LS_USER_KEY = "vk_user_recipes";
const CACHE_TTL = 1000 * 60 * 60; // 1 hour

function loadMealsCache() {
  try {
    const ts = Number(localStorage.getItem(LS_MEALS_TS_KEY) || 0);
    if (Date.now() - ts > CACHE_TTL) return null;
    const raw = localStorage.getItem(LS_MEALS_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch { return null; }
}

function saveMealsCache(meals) {
  try {
    localStorage.setItem(LS_MEALS_KEY, JSON.stringify(meals));
    localStorage.setItem(LS_MEALS_TS_KEY, String(Date.now()));
  } catch {}
}

function loadUserRecipes() {
  try {
    const raw = localStorage.getItem(LS_USER_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}

function saveUserRecipes(recipes) {
  try { localStorage.setItem(LS_USER_KEY, JSON.stringify(recipes)); } catch {}
}

// ── Async thunks ──────────────────────────────────────────

export const fetchRecipes = createAsyncThunk(
  "recipes/fetchRecipes",
  async (_, { rejectWithValue }) => {
    try {
      const cached = loadMealsCache();
      if (cached && cached.length > 0) return cached;

      const categories = [
        "Breakfast","Chicken","Seafood","Vegetarian","Beef",
        "Pasta","Dessert","Pork","Side","Starter","Vegan",
        "Miscellaneous","Goat","Lamb",
      ];

      const results = await Promise.all(
        categories.map((cat) =>
          fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${cat}`)
            .then((r) => r.json())
            .catch(() => ({ meals: [] })),
        ),
      );

      const mealIds = results.flatMap((r) => (r.meals || []).slice(0, 6));

      const batchSize = 10;
      const detailed = [];
      for (let i = 0; i < mealIds.length; i += batchSize) {
        const batch = mealIds.slice(i, i + batchSize);
        const batchResults = await Promise.all(
          batch.map((meal) =>
            fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${meal.idMeal}`)
              .then((r) => r.json())
              .then((d) => d.meals?.[0] ?? null)
              .catch(() => null),
          ),
        );
        detailed.push(...batchResults);
      }

      const meals = detailed.filter(Boolean);
      saveMealsCache(meals);
      return meals;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

export const fetchRecipeById = createAsyncThunk(
  "recipes/fetchRecipeById",
  async (id, { rejectWithValue }) => {
    try {
      const userRecipes = loadUserRecipes();
      const userMatch = userRecipes.find((r) => String(r.id) === String(id));
      if (userMatch) return { ...userMatch, _isUserRecipe: true };

      const response = await fetch(
        `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`,
      );
      if (!response.ok) throw new Error("Failed to fetch");
      const data = await response.json();
      return data.meals?.[0] || null;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

export const fetchUserRecipes = createAsyncThunk(
  "recipes/fetchUserRecipes",
  async () => loadUserRecipes(),
);

export const addUserRecipe = createAsyncThunk(
  "recipes/addUserRecipe",
  async (recipe) => {
    const newRecipe = { ...recipe, id: `user-${Date.now()}`, addedAt: new Date().toISOString() };
    const existing = loadUserRecipes();
    saveUserRecipes([newRecipe, ...existing]);
    return newRecipe;
  },
);

export const updateUserRecipe = createAsyncThunk(
  "recipes/updateUserRecipe",
  async (recipe) => {
    const existing = loadUserRecipes();
    const updated = existing.map((r) =>
      String(r.id) === String(recipe.id) ? { ...r, ...recipe } : r,
    );
    saveUserRecipes(updated);
    return recipe;
  },
);

export const deleteUserRecipe = createAsyncThunk(
  "recipes/deleteUserRecipe",
  async (recipeId) => {
    const existing = loadUserRecipes();
    saveUserRecipes(existing.filter((r) => String(r.id) !== String(recipeId)));
    return recipeId;
  },
);

// ── Slice ─────────────────────────────────────────────────
const recipesSlice = createSlice({
  name: "recipes",
  initialState: {
    meals: [],
    userRecipes: [],
    selectedRecipe: null,
    mealsStatus: "idle",
    detailStatus: "idle",
    userStatus: "idle",
    error: null,
  },
  reducers: {
    clearSelectedRecipe: (state) => {
      state.selectedRecipe = null;
      state.detailStatus = "idle";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchRecipes.pending, (state) => { state.mealsStatus = "loading"; })
      .addCase(fetchRecipes.fulfilled, (state, action) => { state.mealsStatus = "idle"; state.meals = action.payload; })
      .addCase(fetchRecipes.rejected, (state, action) => { state.mealsStatus = "error"; state.error = action.payload; });

    builder
      .addCase(fetchRecipeById.pending, (state) => { state.detailStatus = "loading"; })
      .addCase(fetchRecipeById.fulfilled, (state, action) => { state.detailStatus = "idle"; state.selectedRecipe = action.payload; })
      .addCase(fetchRecipeById.rejected, (state, action) => { state.detailStatus = "error"; state.error = action.payload; });

    builder
      .addCase(fetchUserRecipes.pending, (state) => { state.userStatus = "loading"; })
      .addCase(fetchUserRecipes.fulfilled, (state, action) => { state.userStatus = "idle"; state.userRecipes = action.payload; })
      .addCase(fetchUserRecipes.rejected, (state, action) => { state.userStatus = "error"; state.error = action.payload; });

    builder
      .addCase(addUserRecipe.fulfilled, (state, action) => {
        state.userRecipes = [action.payload, ...state.userRecipes];
      });

    builder
      .addCase(updateUserRecipe.fulfilled, (state, action) => {
        const idx = state.userRecipes.findIndex((r) => String(r.id) === String(action.payload.id));
        if (idx !== -1) state.userRecipes[idx] = { ...state.userRecipes[idx], ...action.payload };
      });

    builder
      .addCase(deleteUserRecipe.fulfilled, (state, action) => {
        state.userRecipes = state.userRecipes.filter((r) => String(r.id) !== String(action.payload));
      });
  },
});

export const { clearSelectedRecipe } = recipesSlice.actions;
export default recipesSlice.reducer;