import { useEffect, useMemo, useRef, useState, useId } from "react";
import { BotEngine, type BotFrame } from "./core/engine";
import { NOTIF_BLUE } from "./core/decor";
import { clamp, easings } from "./core/math";
import { lookTarget, TURN_TIME } from "./core/gaze";
import { EXPRESSION_BY_ID, DEFAULT_EXPRESSION } from "./core/expressions";
import { COLOR_BY_ID, DEFAULT_COLOR, DEFAULT_SHAPE, SHAPE_BY_ID, mixHex } from "./core/skins";
import { STATE_BY_ID, type StateId } from "./core/states";

/**
 * React renderer for the vendored bloub engine (see core/README.md).
 * The engine is a pure function of time; this component owns one rAF loop and
 * paints the sampled BotFrame as SVG — a straight port of bloub's BloubBot.vue.
 */
export interface BotoBotProps {
  size?: number;
  state?: StateId;
  shape?: string;
  color?: string;
  expression?: string;
  /** Page background, used for depth-fog on burst particles and the eye backfill. */
  paper?: string;
  /** Eyes follow the pointer (desktop only; touch has no hover). */
  follow?: boolean;
  className?: string;
}

const R = 100;
const VB = 158;

export function BotoBot({
  size = 320,
  state = "idle",
  shape = DEFAULT_SHAPE,
  color = DEFAULT_COLOR,
  expression = DEFAULT_EXPRESSION,
  paper = "#0A0A0B",
  follow = false,
  className,
}: BotoBotProps) {
  const uid = useId().replace(/[^a-zA-Z0-9]/g, "");
  const maskId = `bot-mask-${uid}`;
  const svgRef = useRef<SVGSVGElement | null>(null);

  const ink = COLOR_BY_ID.get(color)?.hex ?? "#0a0a0c";

  const engineRef = useRef<BotEngine | null>(null);
  if (!engineRef.current) {
    engineRef.current = new BotEngine(
      R,
      state,
      SHAPE_BY_ID.get(shape)?.radii ?? null,
      EXPRESSION_BY_ID.get(expression) ?? null,
    );
  }
  const [frame, setFrame] = useState<BotFrame>(() => engineRef.current!.sample(0));

  // Mutable loop state lives in one ref so prop-watching effects can reach the clock.
  const loop = useRef({
    clock: 0,
    last: 0,
    pointer: null as { x: number; y: number } | null,
    aiming: false,
    turnSince: 0,
    follow,
    stateId: state,
    stateSetAt: 0,
  });
  loop.current.follow = follow;
  loop.current.stateId = state;

  useEffect(() => {
    const engine = engineRef.current!;
    if (engine.state !== state) {
      engine.setState(state, loop.current.clock);
      loop.current.stateSetAt = loop.current.clock;
    }
  }, [state]);

  useEffect(() => {
    engineRef.current!.setShape(SHAPE_BY_ID.get(shape)?.radii ?? null, loop.current.clock);
  }, [shape]);

  useEffect(() => {
    engineRef.current!.setExpression(EXPRESSION_BY_ID.get(expression) ?? null, loop.current.clock);
  }, [expression]);

  useEffect(() => {
    const engine = engineRef.current!;
    const s = loop.current;

    const onPointerMove = (e: PointerEvent) => {
      if (e.pointerType === "touch") return; // a lifted finger would freeze the gaze
      s.pointer = { x: e.clientX, y: e.clientY };
    };
    const onPointerLeave = () => (s.pointer = null);
    window.addEventListener("pointermove", onPointerMove);
    document.addEventListener("pointerleave", onPointerLeave);

    const release = () => {
      if (!s.aiming) return;
      engine.setLook(null, s.clock, TURN_TIME);
      s.aiming = false;
    };

    const aim = () => {
      // Gaze only drives resting-face states; elsewhere the gaze IS the animation.
      if (!STATE_BY_ID.get(engine.state)?.baseFace) return release();
      const box = svgRef.current?.getBoundingClientRect();
      if (!box || box.width === 0 || box.height === 0) return; // NaN guard: engine keeps the last target
      if (!s.aiming) s.turnSince = s.clock;
      engine.setLook(
        lookTarget({
          nx: s.pointer ? clamp((s.pointer.x - (box.left + box.width / 2)) / Math.max(1, window.innerWidth / 2), -1, 1) : 0,
          ny: s.pointer ? clamp((s.pointer.y - (box.top + box.height / 2)) / Math.max(1, window.innerHeight / 2), -1, 1) : 0,
          tour: easings.easeOutQuint(clamp((s.clock - s.turnSince) / TURN_TIME)),
          pointer: s.pointer !== null,
        }),
        s.clock,
      );
      s.aiming = true;
    };

    let raf = 0;
    const tick = (ms: number) => {
      raf = requestAnimationFrame(tick);
      const dt = s.last ? Math.min((ms - s.last) / 1000, 0.064) : 0; // bounded: hidden tabs resume without jumping
      s.last = ms;
      s.clock += dt;

      // Timed states play once in bloub's timeline; standalone we loop them.
      // A small rest gap lets the state's own exit fade finish before it re-arms
      // (engine.setState is a no-op for the same id, so we bounce through a
      // hidden re-entry by re-dating the state at the loop point).
      const def = STATE_BY_ID.get(s.stateId);
      if (def && !def.baseBody && s.clock - s.stateSetAt > def.duration + 0.4) {
        engine.setState("idle", s.clock - 0.001);
        engine.setState(s.stateId, s.clock);
        s.stateSetAt = s.clock;
      }

      if (s.follow) aim();
      else release();
      setFrame(engine.sample(s.clock));
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onPointerMove);
      document.removeEventListener("pointerleave", onPointerLeave);
    };
  }, []);

  const dotAttrs = useMemo(
    () => (dot: BotFrame["dots"][number]) => {
      const fill = dot.color ?? (dot.depth === undefined ? ink : mixHex(paper, ink, dot.depth));
      return { fill, opacity: dot.opacity };
    },
    [ink, paper],
  );

  const dots = (behind: boolean) =>
    frame.dotsBehind === behind &&
    frame.dots.map((dot, i) =>
      dot.d ? (
        <path key={i} {...dotAttrs(dot)} d={dot.d} transform={`translate(${dot.x} ${dot.y}) rotate(${dot.rot ?? 0}) scale(${R})`} />
      ) : (
        <circle key={i} {...dotAttrs(dot)} cx={dot.x} cy={dot.y} r={dot.r} />
      ),
    );

  const arcs = (half: "back" | "front") => (
    <g fill="none" strokeLinecap="round">
      {frame.arcs.map((arc) => (
        <path key={arc.id} d={arc[half]} stroke={`url(#${uid}-${arc.id})`} strokeWidth={arc.width} opacity={arc.opacity} />
      ))}
    </g>
  );

  return (
    <svg
      ref={svgRef}
      width={size}
      height={size}
      viewBox={`${-VB} ${-VB} ${VB * 2} ${VB * 2}`}
      role="img"
      aria-label="Botto avatar"
      className={className}
    >
      <defs>
        {/* Eyes are holes punched through the body, so the silhouette crops them at the rim. */}
        <mask id={maskId} maskUnits="userSpaceOnUse" x={-VB} y={-VB} width={VB * 2} height={VB * 2}>
          <path d={frame.bodyPath} fill="#fff" />
          {frame.eyes.map((eye, i) => (
            <path key={i} d={eye.d} transform={eye.matrix} opacity={eye.alpha} fill="#000" />
          ))}
          {frame.notch && <circle cx={frame.notch.x} cy={frame.notch.y} r={frame.notch.r} fill="#000" />}
        </mask>
        {frame.arcs.map((arc) => (
          <linearGradient
            key={arc.id}
            id={`${uid}-${arc.id}`}
            gradientUnits="userSpaceOnUse"
            x1={arc.grad.x1}
            y1={arc.grad.y1}
            x2={arc.grad.x2}
            y2={arc.grad.y2}
          >
            {arc.grad.stops.map((c, i) => (
              <stop key={i} offset={i / (arc.grad.stops.length - 1)} stopColor={c} />
            ))}
          </linearGradient>
        ))}
      </defs>

      {arcs("back")}
      <g>{dots(true)}</g>
      <g opacity={frame.bodyAlpha}>
        {/* Opaque paper backfill: holes must not reveal the back arc halves drawn behind. */}
        <path d={frame.bodyPath} fill={paper} />
        <g mask={`url(#${maskId})`}>
          <rect x={-VB} y={-VB} width={VB * 2} height={VB * 2} fill={ink} />
        </g>
      </g>
      <g>{dots(false)}</g>
      {frame.notif && <circle cx={frame.notif.x} cy={frame.notif.y} r={frame.notif.r} fill={NOTIF_BLUE} />}
      {arcs("front")}
    </svg>
  );
}
