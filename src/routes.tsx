import { Outlet, ScrollRestoration, Navigate, type RouteObject } from "react-router-dom";
import { Nav } from "./components/nav";
import { Footer } from "./components/footer";
import { HomePage } from "./pages/home";
import { PricingPage } from "./pages/pricing";
import { NewsIndexPage, NewsPostPage } from "./pages/news";
import { AboutPage } from "./pages/about";
import { ContactPage } from "./pages/contact";
import { PrivacyPage } from "./pages/privacy";
import { TermsPage } from "./pages/terms";
import { EarlyAccessPage } from "./pages/early-access";
import { NotFoundPage } from "./pages/not-found";

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

// Shared between the browser entry (createBrowserRouter) and the build-time
// prerenderer (createStaticHandler) — keep this file free of browser globals.
export const routes: RouteObject[] = [
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
      { path: "/contact", element: <ContactPage /> },
      { path: "/privacy", element: <PrivacyPage /> },
      { path: "/terms", element: <TermsPage /> },
      { path: "/early-access", element: <EarlyAccessPage /> },
      { path: "*", element: <NotFoundPage /> },
    ],
  },
];
