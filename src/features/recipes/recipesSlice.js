import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// Async thunk for fetching recipes from mealDB
export const fetchRecipes = createAsyncThunk(
  "recipes/fetchRecipes",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(
        "https://www.themealdb.com/api/json/v1/1/random.php",
      );
      if (!response.ok) throw new Error("Failed to fetch");
      const data = await response.json();
      return data.meals || [];
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

// Async thunk for fetching a specific recipe by ID
export const fetchRecipeById = createAsyncThunk(
  "recipes/fetchRecipeById",
  async (id, { rejectWithValue }) => {
    try {
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

// Async thunk for fetching user recipes from local db
export const fetchUserRecipes = createAsyncThunk(
  "recipes/fetchUserRecipes",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch("http://localhost:3000/userRecipes");
      if (!response.ok) throw new Error("Failed to fetch user recipes");
      return await response.json();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

// Async thunk for adding a user recipe
export const addUserRecipe = createAsyncThunk(
  "recipes/addUserRecipe",
  async (recipe, { rejectWithValue }) => {
    try {
      const response = await fetch("http://localhost:3000/userRecipes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(recipe),
      });
      if (!response.ok) throw new Error("Failed to add recipe");
      return await response.json();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

// Async thunk for updating a user recipe
export const updateUserRecipe = createAsyncThunk(
  "recipes/updateUserRecipe",
  async (recipe, { rejectWithValue }) => {
    try {
      const response = await fetch(
        `http://localhost:3000/userRecipes/${recipe.id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(recipe),
        },
      );
      if (!response.ok) throw new Error("Failed to update recipe");
      return await response.json();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

// Async thunk for deleting a user recipe
export const deleteUserRecipe = createAsyncThunk(
  "recipes/deleteUserRecipe",
  async (recipeId, { rejectWithValue }) => {
    try {
      const response = await fetch(
        `http://localhost:3000/userRecipes/${recipeId}`,
        {
          method: "DELETE",
        },
      );
      if (!response.ok) throw new Error("Failed to delete recipe");
      return recipeId;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

const recipesSlice = createSlice({
  name: "recipes",
  initialState: {
    meals: [],
    userRecipes: [],
    selectedRecipe: null,
    status: "idle",
    error: null,
  },
  reducers: {
    clearSelectedRecipe: (state) => {
      state.selectedRecipe = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch recipes
    builder
      .addCase(fetchRecipes.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchRecipes.fulfilled, (state, action) => {
        state.status = "idle";
        state.meals = action.payload;
      })
      .addCase(fetchRecipes.rejected, (state, action) => {
        state.status = "error";
        state.error = action.payload;
      });

    // Fetch recipe by ID
    builder
      .addCase(fetchRecipeById.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchRecipeById.fulfilled, (state, action) => {
        state.status = "idle";
        state.selectedRecipe = action.payload;
      })
      .addCase(fetchRecipeById.rejected, (state, action) => {
        state.status = "error";
        state.error = action.payload;
      });

    // Fetch user recipes
    builder
      .addCase(fetchUserRecipes.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchUserRecipes.fulfilled, (state, action) => {
        state.status = "idle";
        state.userRecipes = action.payload;
      })
      .addCase(fetchUserRecipes.rejected, (state, action) => {
        state.status = "error";
        state.error = action.payload;
      });

    // Add user recipe
    builder
      .addCase(addUserRecipe.fulfilled, (state, action) => {
        state.userRecipes.push(action.payload);
      })
      .addCase(addUserRecipe.rejected, (state, action) => {
        state.error = action.payload;
      });

    // Update user recipe
    builder
      .addCase(updateUserRecipe.fulfilled, (state, action) => {
        const index = state.userRecipes.findIndex(
          (r) => r.id === action.payload.id,
        );
        if (index !== -1) {
          state.userRecipes[index] = action.payload;
        }
      })
      .addCase(updateUserRecipe.rejected, (state, action) => {
        state.error = action.payload;
      });

    // Delete user recipe
    builder
      .addCase(deleteUserRecipe.fulfilled, (state, action) => {
        state.userRecipes = state.userRecipes.filter(
          (r) => r.id !== action.payload,
        );
      })
      .addCase(deleteUserRecipe.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export const { clearSelectedRecipe } = recipesSlice.actions;
export default recipesSlice.reducer;
