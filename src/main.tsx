import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import "@fontsource-variable/inter";
import "@fontsource-variable/jetbrains-mono";
import "./styles.css";
import { routes } from "./routes";

const router = createBrowserRouter(routes);

// Prerendered pages ship crawler-visible HTML in #root; createRoot clears it
// and renders the interactive app in its place. We deliberately don't hydrate:
// the server pass renders motion components as plain divs (see motion.tsx),
// so the trees intentionally differ.
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
);
