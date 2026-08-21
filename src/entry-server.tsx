import { StrictMode } from "react";
import { renderToString } from "react-dom/server";
import { createStaticHandler, createStaticRouter, StaticRouterProvider } from "react-router";
import "@fontsource-variable/inter";
import "@fontsource-variable/jetbrains-mono";
import "./styles.css";
import { routes } from "./routes";

export { staticPages, homeJsonLd, SITE_URL, OG_IMAGE } from "./lib/seo";
export { posts } from "./content/news";

const handler = createStaticHandler(routes);

/** Render one route to an HTML string for the build-time prerenderer. */
export async function render(path: string): Promise<string> {
  const context = await handler.query(new Request(`https://descanto.com${path}`));
  if (context instanceof Response) throw new Error(`Unexpected redirect while prerendering ${path}`);
  const router = createStaticRouter(handler.dataRoutes, context);
  return renderToString(
    <StrictMode>
      <StaticRouterProvider router={router} context={context} />
    </StrictMode>,
  );
}
