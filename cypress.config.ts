import { defineConfig } from "cypress";
import viteConfig from "./vite.config";

export default defineConfig({
  e2e: {
    baseUrl: "http://localhost:5173",
    setupNodeEvents() {
      // Node event listeners can be defined here
    },
    screenshotOnRunFailure: true,
  },
  component: {
    devServer: {
      framework: "react",
      bundler: "vite",
      viteConfig,
    },
    supportFile: "cypress/support/component.ts",
  },
});
