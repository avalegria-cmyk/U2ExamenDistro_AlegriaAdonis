import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Configura Vite para procesar React.
export default defineConfig({
  plugins: [react()]
});
