import { defineConfig } from "cypress";
import viteConfig from "./vite.config";

export default defineConfig({
  e2e: {
    baseUrl: "http://localhost:5173",
    setupNodeEvents() {
      // Node event listeners can be defined here
    },
  },
  component: {
    devServer: {
      framework: "react",
      bundler: "vite",
      viteConfig, // Reuse your Vite config
    },
  },
});
