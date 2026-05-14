import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  extractIngredients,
  filterByPreferences,
  formatRecipeDetail,
  mapMoodToCategory,
  normalizeMealResult,
} from "../../utils/recipeUtils";

const API_BASE = "https://www.themealdb.com/api/json/v1/1";
const USER_API = "http://localhost:5000/userRecipes";
const LOCAL_STORAGE_KEY = "vibeKitchenUserRecipes";

const safeLocalStorageRecipes = () => {
  try {
    const stored = window.localStorage.getItem(LOCAL_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    return [];
  }
};

const saveLocalRecipes = (recipes) => {
  try {
    window.localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(recipes));
  } catch (error) {
    // ignore
  }
};

const fetchJson = async (url, options) => {
  const response = await fetch(url, options);
  if (!response.ok) {
    throw new Error(`Fetch failed: ${response.statusText}`);
  }
  return response.json();
};

export const searchRecipes = createAsyncThunk(
  "recipes/searchRecipes",
  async (query, thunkAPI) => {
    if (!query || query.trim().length === 0) {
      return { results: [], query: "" };
    }

    const details = await fetchJson(
      `${API_BASE}/search.php?s=${encodeURIComponent(query)}`,
    );
    const meals = details.meals || [];
    const results = meals.map(normalizeMealResult);
    return { results, query };
  },
);

export const fetchMoodRecipes = createAsyncThunk(
  "recipes/fetchMoodRecipes",
  async (mood, thunkAPI) => {
    const category = mapMoodToCategory(mood);
    const response = await fetchJson(
      `${API_BASE}/filter.php?c=${encodeURIComponent(category)}`,
    );
    const meals = response.meals || [];
    const results = meals.map((meal) => ({
      id: meal.idMeal,
      title: meal.strMeal,
      image: meal.strMealThumb,
      category,
      source: "api",
    }));
    return { results, mood };
  },
);

export const fetchRecipeById = createAsyncThunk(
  "recipes/fetchRecipeById",
  async (id, thunkAPI) => {
    if (id.startsWith("user-")) {
      const userRecipes = safeLocalStorageRecipes();
      const recipe = userRecipes.find((item) => item.id === id);
      if (recipe) {
        return { ...recipe, source: "user" };
      }

      try {
        const response = await fetchJson(
          `${USER_API}/${id.replace("user-", "")}`,
        );
        return { ...response, source: "user" };
      } catch (error) {
        throw thunkAPI.rejectWithValue("Unable to load saved recipe.");
      }
    }

    const details = await fetchJson(
      `${API_BASE}/lookup.php?i=${encodeURIComponent(id)}`,
    );
    const meal = (details.meals || [])[0];
    if (!meal) {
      throw thunkAPI.rejectWithValue("Recipe not found.");
    }
    return formatRecipeDetail(meal);
  },
);

export const fetchUserRecipes = createAsyncThunk(
  "recipes/fetchUserRecipes",
  async (_, thunkAPI) => {
    try {
      const response = await fetchJson(USER_API);
      const recipes = response.map((recipe) => ({
        ...recipe,
        id: `user-${recipe.id}`,
      }));
      saveLocalRecipes(recipes);
      return recipes;
    } catch (error) {
      return safeLocalStorageRecipes();
    }
  },
);

export const addUserRecipe = createAsyncThunk(
  "recipes/addUserRecipe",
  async (recipe, thunkAPI) => {
    const payload = { ...recipe };
    try {
      const response = await fetchJson(USER_API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const saved = { ...response, id: `user-${response.id}` };
      const stored = safeLocalStorageRecipes();
      saveLocalRecipes([...stored, saved]);
      return saved;
    } catch (error) {
      const stored = safeLocalStorageRecipes();
      const id = `user-${Date.now()}`;
      const saved = { ...payload, id };
      saveLocalRecipes([...stored, saved]);
      return saved;
    }
  },
);

export const updateUserRecipe = createAsyncThunk(
  "recipes/updateUserRecipe",
  async (recipe, thunkAPI) => {
    const payload = { ...recipe };
    const userId = payload.id.replace("user-", "");
    try {
      await fetchJson(`${USER_API}/${userId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const stored = safeLocalStorageRecipes();
      const updated = stored.map((item) =>
        item.id === payload.id ? payload : item,
      );
      saveLocalRecipes(updated);
      return payload;
    } catch (error) {
      const stored = safeLocalStorageRecipes();
      const updated = stored.map((item) =>
        item.id === payload.id ? payload : item,
      );
      saveLocalRecipes(updated);
      return payload;
    }
  },
);

export const deleteUserRecipe = createAsyncThunk(
  "recipes/deleteUserRecipe",
  async (id, thunkAPI) => {
    const userId = id.replace("user-", "");
    try {
      await fetchJson(`${USER_API}/${userId}`, { method: "DELETE" });
    } catch (error) {
      // ignore
    }
    const stored = safeLocalStorageRecipes();
    const remaining = stored.filter((item) => item.id !== id);
    saveLocalRecipes(remaining);
    return id;
  },
);

const initialState = {
  searchResults: [],
  moodResults: [],
  selectedRecipe: null,
  userRecipes: [],
  mood: null,
  query: "",
  filters: {
    dietary: "",
    condition: "",
    allergies: [],
  },
  status: "idle",
  error: null,
};

const recipesSlice = createSlice({
  name: "recipes",
  initialState,
  reducers: {
    setDietaryFilter(state, action) {
      state.filters.dietary = action.payload;
    },
    setConditionFilter(state, action) {
      state.filters.condition = action.payload;
    },
    toggleAllergy(state, action) {
      const allergy = action.payload;
      if (state.filters.allergies.includes(allergy)) {
        state.filters.allergies = state.filters.allergies.filter(
          (item) => item !== allergy,
        );
      } else {
        state.filters.allergies.push(allergy);
      }
    },
    clearFilters(state) {
      state.filters = { dietary: "", condition: "", allergies: [] };
    },
    clearSelectedRecipe(state) {
      state.selectedRecipe = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(searchRecipes.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(searchRecipes.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.searchResults = action.payload.results;
        state.query = action.payload.query;
      })
      .addCase(searchRecipes.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(fetchMoodRecipes.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchMoodRecipes.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.moodResults = action.payload.results;
        state.mood = action.payload.mood;
      })
      .addCase(fetchMoodRecipes.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(fetchRecipeById.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchRecipeById.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.selectedRecipe = action.payload;
      })
      .addCase(fetchRecipeById.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || action.error.message;
      })
      .addCase(fetchUserRecipes.fulfilled, (state, action) => {
        state.userRecipes = action.payload;
      })
      .addCase(addUserRecipe.fulfilled, (state, action) => {
        state.userRecipes.push(action.payload);
      })
      .addCase(updateUserRecipe.fulfilled, (state, action) => {
        state.userRecipes = state.userRecipes.map((recipe) =>
          recipe.id === action.payload.id ? action.payload : recipe,
        );
      })
      .addCase(deleteUserRecipe.fulfilled, (state, action) => {
        state.userRecipes = state.userRecipes.filter(
          (recipe) => recipe.id !== action.payload,
        );
      });
  },
});

export const {
  setDietaryFilter,
  setConditionFilter,
  toggleAllergy,
  clearFilters,
  clearSelectedRecipe,
} = recipesSlice.actions;

export const selectFilteredRecipes = (state) => {
  const items =
    state.recipes.searchResults.length > 0
      ? state.recipes.searchResults
      : state.recipes.moodResults;
  return filterByPreferences(items, state.recipes.filters);
};

export default recipesSlice.reducer;
