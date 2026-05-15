import { useDispatch, useSelector } from "react-redux";
import { fetchRecipeById } from "../features/recipes/recipesSlice.js";

export function useRecipes() {
  const dispatch = useDispatch();
  const { selectedRecipe, status } = useSelector((state) => state.recipes);
  const loading = status === "loading";

  const fetchById = async (id) => {
    const result = await dispatch(fetchRecipeById(id));
    return result.payload;
  };

  return {
    recipe: selectedRecipe,
    loading,
    fetchById,
  };
}
