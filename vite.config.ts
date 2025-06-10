import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { resolve } from "path";

// https://vite.dev/config/
export default defineConfig(() => {
  // Use process.env.VITE_MODULE_TYPE, fallback to "client"
  // let process.env.VITE_MODULE_TYPE = 'inbox'
  const moduleType = process.env.VITE_MODULE_TYPE || "client";
  // const moduleType = "inbox" || "client"; // For testing purposes, you can change this to "client" or "inbox"

  return {
    plugins: [react(), tailwindcss()],
    define: {
      "import.meta.env.VITE_MODULE_TYPE": JSON.stringify(moduleType),
    },
    build: {
      outDir:
        moduleType === "client"
          ? "dist/client"
          : moduleType === "inbox"
            ? "dist/inbox"
            : "dist",
      emptyOutDir: true,
      rollupOptions: {
        external: (id) => id.endsWith(".test.tsx"),
        output: {
          entryFileNames: "assets/[name].[hash].js",
          chunkFileNames: "assets/[name].[hash].js",
          assetFileNames: "assets/[name].[hash].[ext]",
        },
      },
    },
    base: "./",
    resolve: {
      alias: {
        "@": resolve(__dirname, "src"),
      },
    },
    server: {
      port: moduleType === "inbox" ? 3001 : 3000,
      open: true,
    },
    preview: {
      port: moduleType === "inbox" ? 4001 : 4000,
    },
  };
});
