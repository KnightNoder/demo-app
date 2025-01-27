# Project Folder Structure

This document outlines the folder structure and organization methodology used in the project. The structure is based on the principles of Atomic Design, Redux Toolkit, and best practices for scalable React applications.

## Folder Structure

```
project-root/
├── src/
│   ├── api/                  # Contains all API call files
│   │   └── exampleApi.ts     # Example API file
│   │
│   ├── assets/               # Static assets (images, fonts, etc.)
│   │
│   ├── components/           # Organized based on Atomic Design
│   │   ├── base/             # Reusable, foundational components (e.g., Button, Input)
│   │   └── shared/           # Components built using base components (e.g., Card, Modal)
│   │
│   ├── constants/            # Constants to avoid hardcoding values
│   │   └── constants.ts      # Example constants file
│   │
│   ├── features/             # Feature-specific logic and code
│   │   └── exampleFeature/   # Feature folder containing slices and thunks
│   │       ├── exampleSlice.ts
│   │       └── exampleThunk.ts
│   │
│   ├── layouts/              # Layout components for different pages
│   │   └── exampleLayout.tsx
│   │
│   ├── pages/                # Contains page files for routes
│   │   ├── Home.tsx
│   │   └── About.tsx
│   │
│   ├── store/                # Redux Toolkit store setup
│   │   ├── store.ts          # Redux store configuration
│   │   └── exampleReducer.ts # Example reducer file
│   │
│   ├── styles/               # Tailwind CSS or global styles
│   │   └── index.css         # Main CSS file for Tailwind setup
│   │
│   ├── utils/                # Utility functions and helpers
│   │   └── exampleUtil.ts    # Example utility function
│   │
│   └── main.tsx              # Entry point for the React application
│
├── public/                   # Public assets
│   └── index.html            # Main HTML file
│
├── .env.development          # Environment variables for development
├── .env.staging              # Environment variables for staging
├── .env.production           # Environment variables for production
├── .gitignore                # Files and folders to ignore in git
├── package.json              # Project dependencies and scripts
├── tailwind.config.js        # Tailwind CSS configuration
└── tsconfig.json             # TypeScript configuration
```

## Installation Steps

### 1. Initialize the Project

```bash
npm create vite@latest my-project -- --template react-ts
cd my-project
```

### 2. Install Tailwind CSS

```bash
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init
```

- Configure `tailwind.config.js` to include your source files:

```javascript
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {},
  },
  plugins: [],
};
```

- Add Tailwind to your CSS:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

### 3. Install Redux Toolkit

```bash
npm install @reduxjs/toolkit react-redux
```

- Set up the Redux store in `src/store/store.ts`.

### 4. Set Up Atomic Design Structure

- Create `components/base` and `components/shared` folders to organize reusable and shared components.

### 5. Organize API Calls

- Create an `api` folder and add files for API logic. Example:

```typescript
// src/api/exampleApi.ts
import axios from "axios";
export const fetchExample = async () => {
  const response = await axios.get("/example-endpoint");
  return response.data;
};
```

### 6. Environment Variables

- Create `.env.development`, `.env.staging`, and `.env.production`.
- Add necessary environment variables, e.g.:

```env
REACT_APP_API_URL=https://api.example.com
```

### 7. Git Configuration

- Add a `.gitignore` file to exclude unnecessary files:

```plaintext
node_modules
.env*
build
```

## Explanation of Folders

### `api`

- Contains files for making API calls and managing endpoints.

### `assets`

- Holds static assets such as images, fonts, or other files that don’t require compilation.

### `components`

- **base**: Foundational components like `Button`, `Input`, etc.
- **shared**: Reusable components composed of base components, such as `Card` or `Modal`.

### `constants`

- Contains constants used across the application to avoid hardcoding values. Examples include:
  - **API endpoints**: Centralized URLs for making API requests.
  - **Theme settings**: Values for colors, font sizes, etc., to ensure consistent styling.
  - **Error messages**: Common error strings used in various components or pages.
  - **Configuration settings**: Any values that can be reused throughout the app, such as pagination defaults, timeout durations, or feature flags.

Example `constants.ts` file:

```typescript
export const API_ENDPOINTS = {
  GET_USERS: "/api/users",
  GET_POSTS: "/api/posts",
};

export const THEME = {
  PRIMARY_COLOR: "#3498db",
  SECONDARY_COLOR: "#2ecc71",
};

export const ERROR_MESSAGES = {
  NETWORK_ERROR: "Unable to connect. Please try again later.",
  INVALID_INPUT: "The input provided is invalid.",
};
```

### `features`

- Each feature has its own folder containing slices and thunks to manage feature-specific state and asynchronous logic.

### `layouts`

- Contains layout components that define the structure of different pages.

### `pages`

- Holds all page components, typically corresponding to routes in the application.

### `store`

- Includes the Redux store configuration and reducers to manage application state.

### `styles`

- Contains global CSS files, including Tailwind CSS setup.

### `utils`

- Holds utility functions and helper methods for reusable logic.

### Environment Files

- **.env.development**: Variables for the development environment.
- **.env.staging**: Variables for the staging environment.
- **.env.production**: Variables for the production environment.

### Other Files

- **.gitignore**: Specifies files and folders to ignore in version control.
- **tailwind.config.js**: Tailwind CSS configuration file.
- **tsconfig.json**: TypeScript configuration file.

## Notes

- This structure is designed for scalability, maintainability, and ease of collaboration. Each folder serves a distinct purpose, ensuring a clean separation of concerns across the project.
