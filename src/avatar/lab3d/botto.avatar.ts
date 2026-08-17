import type { AvatarData } from './avatar-runtime'

/**
 * Botto — the Bot mascot.
 *
 * Authored from the Paper board "Botto — Mascot Sheet": one soft ink squircle,
 * two white capsule eyes, nothing else. Every mood is a parameter preset over
 * the same geometry; the procedural engine interpolates between presets and
 * adds blinks, so nothing here is a drawing.
 *
 * Runs on the Avatar Lab procedural engine (see `avatar-runtime.ts`; our copy
 * carries a silhouette-smoothing patch in its `K` resampler).
 */

// ─── Palette ─────────────────────────────────────────────────────────────────

const INK = '#101319'
const WHITE = '#FFFFFF'

// ─── Expressions ─────────────────────────────────────────────────────────────

type EyeMotion = 'none' | 'microSaccades' | 'shake'
type BodyMotion = 'none' | 'slowDrift' | 'shake'

type Expression = {
  id: string
  /** Head rotation in degrees (pitch / yaw / roll). */
  headX: number
  headY: number
  headZ: number
  /** Eye capsule size, per eye. */
  widthLeft: number
  widthRight: number
  heightLeft: number
  heightRight: number
  /** Distance between eye centers. */
  spacing: number
  /** Per-eye offset from the resting position on the face. */
  positionXLeft: number
  positionXRight: number
  positionYLeft: number
  positionYRight: number
  /** Per-eye tilt in degrees. */
  leftAngle: number
  rightAngle: number
  perspective: number
  eyeMotion: EyeMotion
  bodyMotion: BodyMotion
}

/** Botto at rest: tall capsule eyes, head straight. */
const NEUTRAL: Omit<Expression, 'id'> = {
  headX: 0,
  headY: 0,
  headZ: 0,
  widthLeft: 20,
  widthRight: 20,
  heightLeft: 44,
  heightRight: 44,
  spacing: 42,
  positionXLeft: 0,
  positionXRight: 0,
  positionYLeft: 0,
  positionYRight: 0,
  leftAngle: 0,
  rightAngle: 0,
  perspective: 1,
  eyeMotion: 'none',
  bodyMotion: 'none',
}

const expression = (id: string, overrides: Partial<Expression>): Expression => ({
  ...NEUTRAL,
  id,
  ...overrides,
})

/** Symmetric eye helper: same value for the left and right variants of a field. */
const eyes = (p: { width?: number; height?: number; x?: number; y?: number; angle?: number }) => ({
  ...(p.width !== undefined && { widthLeft: p.width, widthRight: p.width }),
  ...(p.height !== undefined && { heightLeft: p.height, heightRight: p.height }),
  ...(p.x !== undefined && { positionXLeft: p.x, positionXRight: p.x }),
  ...(p.y !== undefined && { positionYLeft: p.y, positionYRight: p.y }),
  ...(p.angle !== undefined && { leftAngle: p.angle, rightAngle: -p.angle }),
})

const expressions = {
  // Idle — small head drift between two resting poses.
  'idle-a': expression('idle-a', { headY: 4, headX: 2 }),
  'idle-b': expression('idle-b', { headY: -5, headX: -2, headZ: 2 }),

  // Happy — eyes grow and lift.
  'happy-a': expression('happy-a', { headX: -4, ...eyes({ width: 24, height: 54, y: -8 }) }),
  'happy-b': expression('happy-b', { headZ: 6, ...eyes({ width: 26, height: 58, y: -10 }) }),

  // Thinking — gaze up and to the side, slightly asymmetric eyes.
  'think-a': expression('think-a', {
    headX: -10, headY: 14, headZ: -8,
    heightLeft: 34, heightRight: 40,
    ...eyes({ y: -14 }),
  }),
  'think-b': expression('think-b', {
    headX: -6, headY: -16, headZ: 6,
    heightLeft: 40, heightRight: 34,
    ...eyes({ y: -12 }),
  }),

  // Working — eyes flattened into focus bars.
  'work-a': expression('work-a', eyes({ width: 26, height: 14 })),
  'work-b': expression('work-b', { headY: 6, headX: 3, ...eyes({ width: 26, height: 16 }) }),

  // Sleeping — closed slits, head nodded forward.
  'sleep-a': expression('sleep-a', { headX: 8, ...eyes({ width: 34, height: 8, y: 6 }) }),
  'sleep-b': expression('sleep-b', { headX: 10, headZ: -3, ...eyes({ width: 34, height: 8, y: 8 }) }),

  // Error — splayed, tilted eyes; head wobbles between the two.
  'error-a': expression('error-a', { headY: 6, headZ: 6, ...eyes({ height: 30, angle: 20 }) }),
  'error-b': expression('error-b', {
    headY: -8, headZ: -7,
    heightLeft: 28, heightRight: 34,
    leftAngle: -16, rightAngle: 18,
  }),

  // Listening — wide attentive eyes.
  'listen-a': expression('listen-a', eyes({ width: 26, height: 52 })),
  'listen-b': expression('listen-b', { headY: 10, ...eyes({ width: 26, height: 52 }) }),

  // Curious — head turns side to side.
  'curious-a': expression('curious-a', { headY: 22, headZ: 8, heightLeft: 46, heightRight: 50 }),
  'curious-b': expression('curious-b', { headY: -22, headZ: -8, heightLeft: 50, heightRight: 46 }),

  // Notify — perks up (used by the play-once "notify" animation).
  'notify-a': expression('notify-a', { headX: -12, ...eyes({ width: 24, height: 56, y: -12 }) }),

  // Wink — right eye closes to a bar.
  'wink-a': expression('wink-a', { headZ: 4, widthRight: 44, heightRight: 9 }),
} satisfies Record<string, Expression>

type ExpressionId = keyof typeof expressions

// ─── Animations ──────────────────────────────────────────────────────────────

type Blink = {
  enabled: boolean
  initialDelayMs: number
  minIntervalMs: number
  maxIntervalMs: number
  durationMs: number
}

const BLINK = {
  /** Rare, slow blinks for resting states. */
  calm: { enabled: true, initialDelayMs: 2600, minIntervalMs: 3400, maxIntervalMs: 6200, durationMs: 280 },
  /** Regular blinks for engaged states. */
  normal: { enabled: true, initialDelayMs: 2100, minIntervalMs: 2800, maxIntervalMs: 5000, durationMs: 260 },
  /** Quick, frequent blinks for excited states. */
  lively: { enabled: true, initialDelayMs: 1200, minIntervalMs: 1800, maxIntervalMs: 3600, durationMs: 220 },
  /** Long, attentive gaps. */
  attentive: { enabled: true, initialDelayMs: 3200, minIntervalMs: 4800, maxIntervalMs: 7200, durationMs: 240 },
  none: { enabled: false, initialDelayMs: 0, minIntervalMs: 0, maxIntervalMs: 0, durationMs: 0 },
} satisfies Record<string, Blink>

type Step = {
  expressionId: ExpressionId
  holdMs: number
  transitionMs: number
  transition: 'smooth'
}

type Animation = {
  name: string
  description: string
  playbackMode: 'loop' | 'once'
  blink: Blink
  steps: Step[]
}

const step = (expressionId: ExpressionId, holdMs: number, transitionMs = 500): Step => ({
  expressionId,
  holdMs,
  transitionMs,
  transition: 'smooth',
})

const loop = (name: string, description: string, blink: Blink, steps: Step[]): Animation => ({
  name, description, playbackMode: 'loop', blink, steps,
})

const once = (name: string, description: string, blink: Blink, steps: Step[]): Animation => ({
  name, description, playbackMode: 'once', blink, steps,
})

const animations = {
  idle: loop('idle', 'Slow drift, rare blinks.', BLINK.calm, [
    step('idle-a', 5200, 600),
    step('idle-b', 5200, 600),
  ]),
  happy: loop('happy', 'Big bright eyes, lifted.', BLINK.normal, [
    step('happy-a', 2200, 450),
    step('happy-b', 2200, 450),
  ]),
  thinking: loop('thinking', 'Gaze up and to the side.', BLINK.normal, [
    step('think-a', 2400),
    step('think-b', 2400),
  ]),
  working: loop('working', 'Flattened focus bars.', BLINK.normal, [
    step('work-a', 2600, 450),
    step('work-b', 2600, 450),
  ]),
  sleeping: loop('sleeping', 'Slits, slow nod.', BLINK.none, [
    step('sleep-a', 3800, 900),
    step('sleep-b', 3800, 900),
  ]),
  error: loop('error', 'Splayed eyes, head shake.', BLINK.lively, [
    step('error-a', 1800, 350),
    step('error-b', 1800, 350),
  ]),
  listening: loop('listening', 'Wide attentive eyes.', BLINK.attentive, [
    step('listen-a', 2600),
    step('listen-b', 2600),
  ]),
  curious: loop('curious', 'Looks side to side.', BLINK.normal, [
    step('curious-a', 2300),
    step('curious-b', 2300),
  ]),
  notify: once('notify', 'Perks up once.', BLINK.lively, [
    step('notify-a', 1600, 300),
    step('idle-a', 1200, 450),
  ]),
  wink: once('wink', 'One-eye done signal.', BLINK.none, [
    step('wink-a', 1200, 300),
    step('idle-a', 800, 400),
  ]),
} satisfies Record<string, Animation>

// ─── Avatar ──────────────────────────────────────────────────────────────────

export const avatarData = {
  version: 1,
  avatar: {
    name: 'Botto',
    // "Extra soft" squircle — picked from the proportion comparison round.
    surface: { type: 'cube', width: 192, height: 180, depth: 172, roundness: 0.85 },
    bodyNodes: [],
    colors: { body: INK, eyes: WHITE },
  },
  expressions,
  animations,
} as const satisfies AvatarData

export type AnimationName = keyof typeof avatarData.animations
