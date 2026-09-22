import { defineConfig } from "vitest/config";

export default defineConfig({
  esbuild: {
    jsx: "automatic",
    jsxImportSource: "react",
  },
  test: {
    environment: "happy-dom",
    setupFiles: "src/setupTests.ts",
    include: ["src/**/__tests__/**/*.{ts,tsx}"],
  },
});
