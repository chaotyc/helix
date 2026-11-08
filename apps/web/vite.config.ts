import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      // The UI connects to /ws on its own origin; Vite forwards it to the Helix server.
      // `ws: true` makes the proxy pass WebSocket connections, not just plain HTTP.
      "/ws": { target: "ws://127.0.0.1:8765", ws: true },
    },
  },
});
