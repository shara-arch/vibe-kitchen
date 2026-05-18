import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// ── localStorage helpers ──────────────────────────────────
const LS_USER_KEY = "vk_user_recipes";

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
    userRecipes: [],
    userStatus: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
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

export default recipesSlice.reducer;
