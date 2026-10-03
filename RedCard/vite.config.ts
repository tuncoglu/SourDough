import { defineConfig } from "vite";
import { fileURLToPath } from "node:url";

export default defineConfig({
  base: "/redcard-7c4f/",
  resolve: { alias: { "@": fileURLToPath(new URL("./src", import.meta.url)) } },
  build: { outDir: "../SourDoughMobile/dist/redcard-7c4f", emptyOutDir: true },
});
