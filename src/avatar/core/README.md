# avatar/core — bot animation engine

Vendored from [bloub](https://github.com/jeremy-prt/bloub) by Jérémy Perret (MIT, see LICENSE),
an SVG recreation of the x.ai bot avatar measured frame by frame from the reference video.

Pure TypeScript, zero dependencies, framework-agnostic: `BotEngine` is a pure function of time
(`engine.sample(t)` → a `BotFrame` of paths/matrices), so it can be rendered by React (this site,
`../BotoBot.tsx`), Vue, or the desktop app's renderer. Only imports were changed (`@/bot/*` → `./*`).

14 states: idle, thinking, wink, wide, alert, notification, exclamation, sleep, egg, hexagon,
play, orbit, burst, comet. Shapes: circle, pebble, squircle, capsule, triangle, hexagon, cloud,
droplet. 16 expressions, 12 colorways, pointer-following gaze (`gaze.ts`).

To port back into apps/desktop: copy this folder, keep the LICENSE, render `BotFrame` however you like.
