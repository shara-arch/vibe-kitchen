# VibeKitchen

VibeKitchen is a mood-driven recipe finder built with React, Redux Toolkit, and Vite. It helps users discover meals by mood or search, filter recipes by dietary preferences and allergies, and manage personalized recipes stored locally.

## Features

- Mood-based recipe recommendations
- Search recipes by name or ingredient
- Recipe cards with quick access to meal details
- Personalized recipe management (create, edit, delete)
- Dietary filters for high protein and low carbs
- Allergy filters for nuts, gluten, and dairy
- Health condition support for diabetes-friendly and heart-healthy meals
- Recipe detail view with ingredients and instructions

## Tech stack

- React 19
- Redux Toolkit
- React Router DOM
- Vite
- JSON Server
- TheMealDB external API

## Project structure

- `src/App.jsx` — application entry and routing
- `src/store.js` — Redux store configuration
- `src/features/recipes/recipesSlice.js` — recipe state and API logic
- `src/pages/` — page views (`Home`, `MyRecipes`, `RecipeDetail`)
- `src/components/` — reusable UI components (`RecipeCard`, `RecipeForm`)
- `src/utils/recipeUtils.js` — recipe helpers and filter logic
- `db.json` — local JSON Server data for personalized recipes

## Getting started

### Prerequisites

- Node.js 18+ recommended
- npm installed

### Install dependencies

```bash
npm install
```

### Run the app

```bash
npm run dev
```

This starts the Vite development server and a JSON Server instance for local recipe storage.

### Build for production

```bash
npm run build
```

## Usage

- Open the app in the browser after running `npm run dev`
- Use the search bar to find recipes by name
- Choose a mood to discover recipe recommendations
- Apply dietary, allergy, and health filters to refine results
- Open a recipe card for full ingredients and instructions
- Visit the "My recipes" page to add and manage personal recipes

## Notes

- The app fetches external recipes from [TheMealDB](https://www.themealdb.com/api.php)
- Personalized recipes are stored in `db.json` and use local storage as a fallback
- The sample `db.json` includes a starter recipe for local development

## License

MIT License
