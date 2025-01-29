# Project Folder Structure

This document outlines the folder structure and organization methodology used in the project. The structure is based on the principles of Atomic Design, Redux Toolkit, and best practices for scalable React applications.

## Folder Structure

```
project-root/
│
├── src/
│ ├── api/ # API call files
│ ├── assets/ # Static assets
│ ├── components/ # Atomic Design components
│ │ ├── atoms/
│ │ ├── molecules/
│ │ ├── organisms/
│ │ ├── templates/
│ │ └── shared/
│ ├── config/ # Configuration files
│ ├── constants/ # Constants
│ ├── features/ # Feature-Sliced Design
│ │ ├── auth/
│ │ │ ├── components/
│ │ │ ├── hooks/
│ │ │ ├── slices/
│ │ │ └── thunks/
│ │ └── dashboard/
│ │ ├── components/
│ │ ├── hooks/
│ │ ├── slices/
│ │ └── thunks/
│ ├── hooks/ # Custom hooks
│ ├── layouts/ # Layout components
│ ├── pages/ # Page components
│ ├── store/ # Redux store
│ ├── styles/ # Tailwind CSS or global styles
│ ├── types/ # TypeScript types/interfaces
│ └── utils/ # Utility functions
│
├── public/ # Public assets
├── .env.development # Environment variables
├── .env.staging
├── .env.production
├── .gitignore
├── package.json
├── tailwind.config.js
├── tsconfig.json
├── jest.config.js # Jest configuration
├── cypress.config.js # Cypress configuration
├── .eslintrc.js # ESLint configuration
├── .prettierrc.js # Prettier configuration
└── README.md # Project documentation
```

## Installation Steps

1. **Clone the repository:**

   ```bash
   git clone <repository-url>
   cd <project-directory>
   ```

2. **Install dependencies:**

   - Ensure you have [Node.js](https://nodejs.org/) installed. Then, run the following command to install the necessary packages:

   ```bash
   npm install
   ```

3. **Run the development server:**

   - After installation, start the development server using:

   ```bash
   npm run dev
   ```

4. **Environment Variables:**
   - Make sure to set up the environment variables in the `.env` files. The project includes `.env.development`, `.env.staging`, and `.env.production` for different environments.

## Folder Structure

### `src/`

This is the main source directory for your application.

- **`api/`**: Contains all API call files, handling network requests and API integration.
- **`assets/`**: Stores static assets like images, fonts, and other resources that are directly served.
- **`components/`**: Implements components based on Atomic Design principles:
  - **`atoms/`**: Small, reusable components like buttons and input fields.
  - **`molecules/`**: Combinations of atoms, such as form groups and card elements.
  - **`organisms/`**: Larger components made from molecules and atoms, like headers or sidebars.
  - **`templates/`**: Page-level layout structures that define the arrangement of organisms.
  - **`shared/`**: Components shared across the entire project.
- **`config/`**: Holds configuration files for third-party libraries and services.
- **`constants/`**: Defines constants used throughout the application, such as error messages, status codes, or theme-related values.
- **`features/`**: Implements Feature-Sliced Design:
  - **`auth/`**: Authentication feature, including components, hooks, slices (Redux), and thunks (for async actions).
  - **`dashboard/`**: Dashboard feature, similarly organized as `auth/` with components, hooks, slices, and thunks.
- **`hooks/`**: Contains custom React hooks used across the project.
- **`layouts/`**: Layout components that define the overall structure of pages (e.g., with header, sidebar, footer).
- **`pages/`**: Page-level components corresponding to routes in the app.
- **`store/`**: Contains Redux store configuration, reducers, and actions.
- **`styles/`**: Contains global styles and configurations for Tailwind CSS (or other global styles).
- **`types/`**: Contains TypeScript types and interfaces used throughout the app.
- **`utils/`**: Utility functions that help with general operations, such as formatting or validation.

### `public/`

- Contains all the public assets that will be available to the web server, such as icons, static images, and the main HTML file.

### Root Files

- **`.env.development`, `.env.staging`, `.env.production`**: Environment variable files for different environments. Be sure to configure these based on your project’s requirements.
- **`.gitignore`**: Specifies files and directories that should not be tracked by Git.
- **`package.json`**: Contains project metadata, dependencies, and scripts for build and development.
- **`tailwind.config.js`**: Configuration file for Tailwind CSS.
- **`tsconfig.json`**: TypeScript configuration file.
- **`jest.config.js`**: Jest configuration for testing.
- **`cypress.config.js`**: Cypress configuration for end-to-end testing.
- **`.eslintrc.js`**: ESLint configuration for code linting.
- **`.prettierrc.js`**: Prettier configuration for code formatting.
- **`README.md`**: Project documentation file (this file).
