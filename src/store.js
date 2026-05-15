import { configureStore } from "@reduxjs/toolkit";
import recipesReducer from "./features/recipes/recipesSlice";

export default configureStore({
  reducer: {
    recipes: recipesReducer,
  },
});
