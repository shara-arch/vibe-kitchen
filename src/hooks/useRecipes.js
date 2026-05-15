import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchRecipeById,
  fetchUserRecipes,
  addUserRecipe,
  updateUserRecipe,
  deleteUserRecipe,
} from "../features/recipes/recipesSlice.js";

export function useRecipes() {
  const dispatch = useDispatch();
  const {
    selectedRecipe,
    userRecipes = [],
    status,
  } = useSelector((state) => state.recipes);

  useEffect(() => {
    if (userRecipes.length === 0) {
      dispatch(fetchUserRecipes());
    }
  }, [dispatch, userRecipes.length]);

  const loading = status === "loading";

  const fetchById = async (id) => {
    const result = await dispatch(fetchRecipeById(id));
    return result.payload;
  };

  const addRecipe = async (recipe) => {
    const result = await dispatch(addUserRecipe(recipe));
    return result.payload;
  };

  const updateMyRecipe = async (recipeId, changes) => {
    const result = await dispatch(
      updateUserRecipe({ id: recipeId, ...changes }),
    );
    return result.payload;
  };

  const removeMyRecipe = async (recipeId) => {
    await dispatch(deleteUserRecipe(recipeId));
  };

  return {
    recipe: selectedRecipe,
    loading,
    fetchById,
    myRecipes: userRecipes,
    addRecipe,
    removeMyRecipe,
    updateMyRecipe,
  };
}
