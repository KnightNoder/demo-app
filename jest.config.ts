import { Config } from "jest";

const config: Config = {
  preset: "ts-jest",
  testEnvironment: "jsdom",
  roots: ["<rootDir>/__tests__"], // Set test root directory
  collectCoverage: true,
  collectCoverageFrom: [
    "src/**/*.{ts,tsx}", // Include source files
    "!src/main.tsx", // Exclude entry point
    "!src/vite-env.d.ts", // Exclude Vite environment types
  ],
  coverageDirectory: "coverage",
  coverageReporters: ["json", "lcov", "text", "clover"],
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"], // Optional setup file
  coveragePathIgnorePatterns: [
    "<rootDir>/assets/Icons/Icons.tsx", // Exclude Icons.tsx from coverage
  ],
};

export default config;
