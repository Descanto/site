import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider, createBrowserRouter, Outlet, ScrollRestoration, Navigate } from "react-router-dom";
import "@fontsource-variable/inter";
import "@fontsource-variable/jetbrains-mono";
import "./styles.css";
import { Nav } from "./components/nav";
import { Footer } from "./components/footer";
import { HomePage } from "./pages/home";
import { PricingPage } from "./pages/pricing";
import { NewsIndexPage, NewsPostPage } from "./pages/news";
import { AboutPage } from "./pages/about";

function Layout() {
  return (
    <>
      <ScrollRestoration />
      <Nav />
      <main>
        <Outlet />
      </main>
      <Footer />
    </>
  );
}

const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      { path: "/", element: <HomePage /> },
      { path: "/pricing", element: <PricingPage /> },
      { path: "/canto", element: <Navigate to="/" replace /> },
      { path: "/canto/pricing", element: <Navigate to="/pricing" replace /> },
      { path: "/news", element: <NewsIndexPage /> },
      { path: "/news/:slug", element: <NewsPostPage /> },
      { path: "/about", element: <AboutPage /> },
      { path: "*", element: <HomePage /> },
    ],
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
);
