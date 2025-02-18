import { Config } from "jest";

const config: Config = {
  preset: "ts-jest",
  testEnvironment: "jsdom",
  roots: ["<rootDir>/__tests__"], // Maintaining your existing test root directory

  moduleDirectories: ["node_modules", "src"],
  testMatch: ["**/__tests__/**/*.{ts,tsx}", "**/*.{spec,test}.{ts,tsx}"],
  testTimeout: 10000,

  // Coverage configuration (maintaining your existing settings)
  collectCoverage: true,
  collectCoverageFrom: [
    "src/**/*.{ts,tsx}",
    "!src/main.tsx",
    "!src/vite-env.d.ts",
  ],
  coverageDirectory: "coverage",
  coverageReporters: ["json", "lcov", "text", "clover"],
  coveragePathIgnorePatterns: ["<rootDir>/assets/Icons/Icons.tsx"],

  // Setup files (maintaining your existing setup)
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],

  // Adding CI-specific configurations
  // reporters: [
  //   "default",
  //   ["jest-junit", {
  //     outputDirectory: "test-results/jest",
  //     outputName: "junit.xml",
  //     classNameTemplate: "{classname}",
  //     titleTemplate: "{title}",
  //     ancestorSeparator: " › ",
  //     usePathForSuiteName: true
  //   }]
  // ],

  // Module handling (adding if not present)
  moduleNameMapper: {
    "\\.(css|less|scss|sass)$": "identity-obj-proxy",
    "\\.(jpg|jpeg|png|gif|webp|svg)$": "<rootDir>/__mocks__/fileMock.ts",
  },

  // Transform configuration
  transform: {
    "^.+\\.tsx?$": [
      "ts-jest",
      {
        tsconfig: "tsconfig.json",
      },
    ],
  },
};

export default config;