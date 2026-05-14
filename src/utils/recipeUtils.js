export const mapMoodToCategory = (mood) => {
  const mapping = {
    happy: "Chicken",
    tired: "Soup",
    energetic: "Vegetarian",
    cozy: "Beef",
    balanced: "Seafood",
  };
  return mapping[mood] || "Seafood";
};

export const extractIngredients = (meal) => {
  const ingredients = [];
  for (let index = 1; index <= 20; index += 1) {
    const ingredient = meal[`strIngredient${index}`];
    const measure = meal[`strMeasure${index}`];
    if (ingredient && ingredient.trim()) {
      ingredients.push(
        `${measure ? measure.trim() : ""} ${ingredient.trim()}`.trim(),
      );
    }
  }
  return ingredients;
};

export const formatRecipeDetail = (meal) => ({
  id: meal.idMeal,
  title: meal.strMeal,
  image: meal.strMealThumb,
  category: meal.strCategory || "",
  area: meal.strArea || "",
  tags: meal.strTags ? meal.strTags.split(",").map((tag) => tag.trim()) : [],
  instructions: meal.strInstructions || "",
  ingredients: extractIngredients(meal),
  sourceName: meal.strSource || "",
  youtube: meal.strYoutube || "",
  source: "api",
});

export const normalizeMealResult = (meal) => ({
  id: meal.idMeal,
  title: meal.strMeal,
  image: meal.strMealThumb,
  category: meal.strCategory || "",
  area: meal.strArea || "",
  tags: meal.strTags ? meal.strTags.split(",").map((tag) => tag.trim()) : [],
  source: "api",
});

export const filterByPreferences = (recipes, filters) => {
  const { dietary, condition, allergies } = filters;
  if (!dietary && !condition && allergies.length === 0) {
    return recipes;
  }

  return recipes.filter((recipe) => {
    const title = recipe.title.toLowerCase();
    const category = (recipe.category || "").toLowerCase();
    const tags = (recipe.tags || []).map((tag) => tag.toLowerCase());
    const ingredientText = (recipe.ingredients || []).join(" ").toLowerCase();
    let matchesDiet = true;
    let matchesCondition = true;
    let avoidsAllergy = true;

    if (dietary === "high-protein") {
      matchesDiet = /chicken|beef|steak|pork|seafood|tuna|salmon/.test(
        title + category + tags.join(" "),
      );
    }
    if (dietary === "low-carbs") {
      matchesDiet = /salad|soup|vegetarian|zucchini|cauliflower|seafood/.test(
        title + category + tags.join(" "),
      );
    }
    if (condition === "diabetes") {
      matchesCondition = !/dessert|cake|ice cream|pie|sugar|sweet/.test(
        title + category + tags.join(" "),
      );
    }
    if (condition === "heart-healthy") {
      matchesCondition = /salad|fish|vegetable|grilled|baked|roasted/.test(
        title + category + tags.join(" "),
      );
    }
    if (allergies.length > 0) {
      const allergenText =
        ingredientText + " " + title + " " + category + " " + tags.join(" ");
      avoidsAllergy = !allergies.some((allergy) => {
        if (allergy === "nuts") {
          return /nut|almond|walnut|cashew|pecan|peanut/.test(allergenText);
        }
        if (allergy === "gluten") {
          return /flour|wheat|bread|pasta|noodle/.test(allergenText);
        }
        if (allergy === "dairy") {
          return /milk|butter|cheese|cream|yogurt|paneer/.test(allergenText);
        }
        return false;
      });
    }

    return matchesDiet && matchesCondition && avoidsAllergy;
  });
};
