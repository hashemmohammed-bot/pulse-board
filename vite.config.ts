import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import stylex from "@stylexjs/unplugin";

const src = fileURLToPath(new URL("./src", import.meta.url));
const root = fileURLToPath(new URL(".", import.meta.url));

export default defineConfig({
  plugins: [
    // The StyleX plugin must run before the React plugin to keep Fast Refresh
    // working. It resolves `*.stylex.ts` imports itself, so the `@` alias has to
    // be repeated here — Vite's resolve.alias is invisible to its Babel pass.
    stylex.vite({
      useCSSLayers: true,
      aliases: { "@/*": [`${src}/*`] },
      unstable_moduleResolution: { type: "commonJS", rootDir: root },
    }),
    react(),
  ],
  resolve: {
    // This config is ESM, so __dirname does not exist here.
    alias: { "@": src },
  },
  server: { port: 5173, strictPort: true },
});
