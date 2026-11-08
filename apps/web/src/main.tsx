import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { App } from "./App.tsx";
import { connect } from "./connection.ts";

// Open the server connection once, at startup, outside React.
// (Inside a component, StrictMode would run it twice in development and open two sockets.)
connect();

// Find the empty <div id="root"> in index.html and let React draw the app inside it.
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
