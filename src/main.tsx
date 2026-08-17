import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider, createBrowserRouter, Outlet, ScrollRestoration } from "react-router-dom";
import "@fontsource-variable/inter";
import "@fontsource-variable/space-grotesk";
import "@fontsource-variable/jetbrains-mono";
import "./styles.css";
import { Nav } from "./components/nav";
import { Footer } from "./components/footer";
import { HomePage } from "./pages/home";
import { BottoPage } from "./pages/botto";
import { CantoPage } from "./pages/canto";
import { PricingPage } from "./pages/pricing";
import { NewsIndexPage, NewsPostPage } from "./pages/news";
import { AboutPage } from "./pages/about";
import { AvatarPage } from "./pages/avatar";

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
      { path: "/botto", element: <BottoPage /> },
      { path: "/canto", element: <CantoPage /> },
      { path: "/canto/pricing", element: <PricingPage /> },
      { path: "/news", element: <NewsIndexPage /> },
      { path: "/news/:slug", element: <NewsPostPage /> },
      { path: "/about", element: <AboutPage /> },
      { path: "/avatar", element: <AvatarPage /> },
      { path: "*", element: <HomePage /> },
    ],
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
);
