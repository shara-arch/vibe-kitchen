# VibeKitchen 🍳

A mood-based recipe discovery app built with React. Tell it how you're feeling, set any dietary or allergy filters, and get a personalised grid of recipes to cook right now. You can also save and manage your own personal recipe collection.

---

## Table of Contents

- [Features](#features)
- [User Guide](#user-guide)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [Pages & Routes](#pages--routes)
- [Scripts](#scripts)
- [Vite & React Configuration](#vite--react-configuration)
- [Testing](#testing)
- [License](#license)

---

## Features

- **Mood-based discovery** — Choose a vibe (Happy, Tired, Energetic, Morning, Evening) to surface recipes that match how you feel
- **Search** — Find recipes by ingredient or dish name (e.g. "chicken", "pasta", "salad")
- **Dietary filters** — Filter by High Protein or Low Carbs or Veganism
- **Health conditions** — Filter for Diabetes-friendly or Heart Healthy meals
- **Allergy filters** — Exclude recipes containing Nuts, Gluten, or Dairy
- **Recipe detail view** — Full ingredient list and step-by-step cooking instructions
- **My Recipes** — Add, view, and delete your own personal recipes
- **Persistent storage** — Personal recipes are saved via a local JSON Server

---

## User Guide

### 1. Pick a Mood

On the **Discover** page, you'll see a row of mood chips at the top:

> Happy · Tired · Energetic · Morning · Evening

Click the one that matches how you're feeling. The recipe grid will immediately update to show meals suited to that mood. The app defaults to **Happy** on first load.

You can also skip the mood selector entirely and use the **search bar** to find recipes by name or ingredient.

### 2. Apply Filters (Optional)

Below the mood selector, three filter groups let you narrow down the results:

| Filter group | Options |
|---|---|
| **Dietary** | High Protein, Low Carbs, Vegeterian, Vegan |
| **Health condition** | Diabetes-friendly, Heart Healthy |
| **Allergies** | Nuts, Gluten, Dairy |

Select as many as you need. Filters stack — so you can pick *Energetic* + *High Protein* + *Gluten-free* at the same time. Click **Clear filters** to reset them all at once.

### 3. Browse the Recipe Grid

The results panel shows a grid of recipe cards that match your mood and filters. Each card displays:

- Recipe image
- Title and category
- Relevant diet or health labels

If no recipes match the active combination, a prompt suggests changing your mood or clearing filters.

### 4. View a Full Recipe

Click any recipe card to open the **Recipe Detail** page. Here you'll find:

- Full ingredient list with quantities
- Step-by-step cooking instructions
- Health and allergy notes

Use the **Back to discovery** button to return to the main grid without losing your filter state.

### 5. My Recipes

Navigate to **My Recipes** in the top nav to manage your personal collection:

- Click **Add recipe** to fill in a title, category, ingredients, instructions, and labels
- Each saved recipe appears as a card in your collection
- Click **Delete** on any card to remove it permanently

Personal recipes are stored in `db.json` via JSON Server and persist across page refreshes during local development.

---

## Tech Stack

| Layer | Tools |
|---|---|
| UI | React 19, React Router v7, Tailwind CSS |
| State management | Redux Toolkit, React Redux |
| Local backend | JSON Server (`db.json`) on port 5000 |
| Build tool | Vite |
| Testing | Jest, React Testing Library |
| Icons | Lucide React |

---

## Getting Started

### Prerequisites

- Node.js v18 or higher
- npm

### Installation

```bash
# Clone the repository
git clone https://github.com/shara-arch/vibe-kitchen.git
cd vibe-kitchen

# Install dependencies
npm install
```

### Running the App

```bash
npm run dev
```

This starts two processes concurrently:
- **Vite dev server** — http://localhost:5173
- **JSON Server** — http://localhost:5000 (serves `db.json` for personal recipes)

Both must be running for the app to work fully.

### Building for Production

```bash
npm run build       # Compile and bundle
npm run preview     # Preview the production build locally
```

> **Note:** JSON Server is a development tool only. A production deployment would require a real backend to replace it.

---

## Project Structure

```
vibe-kitchen/
├── public/                  # Static assets (SVG icons, favicon)
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── RecipeCard.jsx   # Individual recipe card
│   │   ├── RecipeGrid.jsx   # Grid layout for results
│   │   ├── SearchBar.jsx    # Search input and submit
│   │   ├── FilterPanel.jsx  # Dietary & allergy filter chips
│   │   ├── MoodSelector.jsx # Mood chip row
│   │   └── RecipeForm.jsx   # Add personal recipe form
│   ├── features/
│   │   └── recipes/
│   │       └── recipesSlice.js  # Redux state, async thunks, selectors
│   ├── pages/
│   │   ├── Home.jsx         # Discover page
│   │   ├── MyRecipes.jsx    # Personal recipe collection
│   │   └── RecipeDetail.jsx # Full recipe view
│   ├── utils/               # Helper/utility functions
│   ├── App.jsx              # Root component and routing
│   ├── store.js             # Redux store configuration
│   └── index.css            # Global styles
├── db.json                  # Local database (JSON Server)
├── tailwind.config.js
└── vite.config.js
```

---

## Pages & Routes

| Route | Page | Description |
|---|---|---|
| `/` | Home | Mood selector, search bar, filters, recipe grid |
| `/my-recipes` | My Recipes | Add and manage personal recipes |
| `/recipes/:id` | Recipe Detail | Full ingredients and instructions |

---

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start Vite dev server + JSON Server |
| `npm run build` | Build for production |
| `npm run preview` | Preview the production build |
| `npm run lint` | Run ESLint across the project |

---

## Testing

Manual tests are documented in [`TESTING.md`](TESTING.md). Key flows covered include:

- Mood chip selection updates the recipe grid
- Search returns matching results
- Allergy filters remove flagged recipes
- Recipe detail page renders ingredients and instructions
- Add and delete personal recipes

Automated test tooling (Jest + React Testing Library) is configured and ready for unit and integration tests.

---

## License

[MIT](LICENSE)