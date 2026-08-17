/**
 * Botto's own animation vocabulary, running on the vendored engine.
 *
 * The values here are ported from the original Avatar Lab presets in
 * bot/apps/desktop/src/avatar/botto.avatar.ts — they are OUR choreography
 * (authored from the Paper mascot sheet), not the measured x.ai states in
 * core/states.ts. Unit conversion: the original engine used pixels on a
 * ~192px body (eye 20×44, spacing 42); this engine uses ball-radius units
 * (eye 0.186×0.412, split in degrees).
 *
 * Identity differences from the reference material, on purpose:
 * - rest gaze is head-straight (the reference rests ~28° off-axis)
 * - default body is our squircle, ink/paper palette
 * - notification accent is Descanto blue, not the reference blue
 */
import type { BotExpression } from "./core/expressions";
import { EYE_SPLIT } from "./core/face";
import { clamp, easings } from "./core/math";
import { circle } from "./core/shape";
import { STATES, STATE_BY_ID, type Pose, type StateDef, type StateId } from "./core/states";

// px → ball-radius units (derived from neutral: 20px→0.186, 44px→0.412, 42px→15.46°)
const W = 0.186 / 20;
const H = 0.412 / 44;
const SPLIT = EYE_SPLIT / 42;

type EyePx = { w?: number; h?: number; tilt?: number };

/** Build a BotExpression from the original preset's pixel values. */
function expr(
  id: string,
  p: {
    headX?: number; // pitch
    headY?: number; // yaw
    headZ?: number; // roll
    spacing?: number;
    eyeY?: number; // shared vertical eye offset (px) — folded into pitch
    left?: EyePx;
    right?: EyePx;
  } = {},
): BotExpression {
  const eyeOf = (e: EyePx | undefined) => ({
    w: (e?.w ?? 20) * W,
    h: (e?.h ?? 44) * H,
    tilt: e?.tilt ?? 0,
    open: 1,
  });
  return {
    id: id as BotExpression["id"],
    gaze: {
      pitch: (p.headX ?? 0) + (p.eyeY ?? 0) * SPLIT,
      yaw: p.headY ?? 0,
      roll: p.headZ ?? 0,
    },
    split: (p.spacing ?? 42) * SPLIT,
    eyes: [eyeOf(p.left), eyeOf(p.right)],
  };
}

const both = (e: EyePx) => ({ left: e, right: { ...e, tilt: e.tilt === undefined ? undefined : -e.tilt } });

// ─── Expressions (ported one-to-one from botto.avatar.ts) ────────────────────

const E = {
  neutral: expr("neutral"),
  idleA: expr("idle-a", { headY: 4, headX: 2 }),
  idleB: expr("idle-b", { headY: -5, headX: -2, headZ: 2 }),
  happyA: expr("happy-a", { headX: -4, eyeY: -8, ...both({ w: 24, h: 54 }) }),
  happyB: expr("happy-b", { headZ: 6, eyeY: -10, ...both({ w: 26, h: 58 }) }),
  thinkA: expr("think-a", { headX: -10, headY: 14, headZ: -8, eyeY: -14, left: { h: 34 }, right: { h: 40 } }),
  thinkB: expr("think-b", { headX: -6, headY: -16, headZ: 6, eyeY: -12, left: { h: 40 }, right: { h: 34 } }),
  workA: expr("work-a", both({ w: 26, h: 14 })),
  workB: expr("work-b", { headY: 6, headX: 3, ...both({ w: 26, h: 16 }) }),
  sleepA: expr("sleep-a", { headX: 8, eyeY: 6, ...both({ w: 34, h: 8 }) }),
  sleepB: expr("sleep-b", { headX: 10, headZ: -3, eyeY: 8, ...both({ w: 34, h: 8 }) }),
  errorA: expr("error-a", { headY: 6, headZ: 6, ...both({ h: 30, tilt: 20 }) }),
  errorB: expr("error-b", { headY: -8, headZ: -7, left: { h: 28, tilt: -16 }, right: { h: 34, tilt: 18 } }),
  listenA: expr("listen-a", both({ w: 26, h: 52 })),
  listenB: expr("listen-b", { headY: 10, ...both({ w: 26, h: 52 }) }),
  curiousA: expr("curious-a", { headY: 22, headZ: 8, left: { h: 46 }, right: { h: 50 } }),
  curiousB: expr("curious-b", { headY: -22, headZ: -8, left: { h: 50 }, right: { h: 46 } }),
  notifyA: expr("notify-a", { headX: -12, eyeY: -12, ...both({ w: 24, h: 56 }) }),
  winkA: expr("wink-a", { headZ: 4, right: { w: 44, h: 9 } }),
};

// ─── Motions: our original animation table (holds/transitions preserved) ─────

export interface MotionStep {
  expr: BotExpression;
  /** total time on this step (hold + transition), ms */
  ms: number;
}

export interface Motion {
  id: string;
  label: string;
  steps: MotionStep[];
}

const motion = (id: string, label: string, steps: [BotExpression, number][]): Motion => ({
  id,
  label,
  steps: steps.map(([e, ms]) => ({ expr: e, ms })),
});

export const MOTIONS: Motion[] = [
  motion("idle", "Idle", [[E.idleA, 5800], [E.idleB, 5800]]),
  motion("happy", "Happy", [[E.happyA, 2650], [E.happyB, 2650]]),
  motion("thinking", "Thinking", [[E.thinkA, 2900], [E.thinkB, 2900]]),
  motion("working", "Working", [[E.workA, 3050], [E.workB, 3050]]),
  motion("sleeping", "Sleeping", [[E.sleepA, 4700], [E.sleepB, 4700]]),
  motion("error", "Error", [[E.errorA, 2150], [E.errorB, 2150]]),
  motion("listening", "Listening", [[E.listenA, 3100], [E.listenB, 3100]]),
  motion("curious", "Curious", [[E.curiousA, 2800], [E.curiousB, 2800]]),
  motion("notify", "Notify", [[E.notifyA, 1900], [E.neutral, 1650]]),
  motion("wink", "Wink", [[E.winkA, 1500], [E.neutral, 1200]]),
];

export const MOTION_BY_ID = new Map(MOTIONS.map((m) => [m.id, m]));

// ─── Original morph states (not from the reference video) ────────────────────

const basePose = (over: Partial<Pose> = {}): Pose => ({
  sil: circle(1),
  offX: 0,
  offY: 0,
  gaze: { yaw: 0, pitch: 0, roll: 0 },
  split: EYE_SPLIT,
  eyes: [
    { w: 0.186, h: 0.412, tilt: 0, open: 1 },
    { w: 0.186, h: 0.412, tilt: 0, open: 1 },
  ],
  eyeAlpha: 1,
  bodyAlpha: 1,
  dots: [],
  arcs: [],
  notif: null,
  dotsBehind: false,
  ...over,
});

/**
 * Hibernate → wake: the ball closes its eyes, shrinks to a resting dot that
 * breathes slowly, then re-inflates. Canto vocabulary: desktops keep their
 * state while hibernated and wake in place.
 */
const hibernate: StateDef = {
  id: "hibernate" as StateId,
  hint: "Eyes close, body rests as a breathing dot, then wakes in place",
  duration: 4.2,
  morph: 0.5,
  blinkIn: false,
  baseBody: false,
  baseFace: false,
  pose: (t) => {
    const down = easings.easeInOutCubic(clamp((t - 0.35) / 0.85)); // 1 → asleep
    const up = easings.easeOutCubic(clamp((t - 3.1) / 0.7)); // 1 → awake again
    const asleep = down * (1 - up);
    const breath = 1 + 0.06 * Math.sin(t * 2.4) * asleep;
    const scale = (1 - 0.86 * asleep) * breath;
    return basePose({
      sil: circle(scale, { cy: 0.12 * asleep }),
      eyeAlpha: clamp(1 - down * 2.5) + up,
      eyes: [
        { w: 0.186, h: 0.412 * (1 - down) + 0.07 * down, tilt: 0, open: 1 },
        { w: 0.186, h: 0.412 * (1 - down) + 0.07 * down, tilt: 0, open: 1 },
      ],
      gaze: { yaw: 0, pitch: 6 * asleep, roll: 0 },
    });
  },
};

/**
 * Fork: a clone swells out from behind the body, slides aside, then merges
 * back. Canto vocabulary: fork a running desktop, promote or drop the copy.
 */
const fork: StateDef = {
  id: "fork" as StateId,
  hint: "A clone slides out from behind the body and merges back",
  duration: 3.6,
  morph: 0.45,
  blinkIn: true,
  baseBody: false,
  baseFace: false,
  pose: (t) => {
    const out = easings.easeInOutCubic(clamp((t - 0.25) / 0.8)); // clone emerges
    const back = easings.easeInOutCubic(clamp((t - 2.3) / 0.9)); // clone merges back
    const k = out * (1 - back);
    const lean = -0.22 * k; // parent shifts left to make room
    return basePose({
      sil: circle(1 - 0.08 * k, { cx: lean }),
      gaze: { yaw: 26 * k, pitch: 0, roll: 0 }, // parent watches its copy
      dots: [
        {
          x: lean + 1.28 * k,
          y: -0.05 * k,
          r: (0.34 + 0.3 * k) * clamp(out * 3),
          opacity: clamp(out * 2) * (1 - back * back),
        },
      ],
      dotsBehind: back > 0.5,
    });
  },
};

for (const def of [hibernate, fork]) {
  if (!STATE_BY_ID.has(def.id)) {
    STATES.push(def);
    STATE_BY_ID.set(def.id, def);
  }
}

export const BOTTO_STATES = [hibernate, fork];
