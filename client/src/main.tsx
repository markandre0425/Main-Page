import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { ContextProviders } from "./contexts/AuthContext";

// Add global CSS variables for the fire safety themed colors
import "./lib/theme-vars.css";

createRoot(document.getElementById("root")!).render(
  <QueryClientProvider client={queryClient}>
    <ContextProviders>
      <App />
    </ContextProviders>
  </QueryClientProvider>
);
