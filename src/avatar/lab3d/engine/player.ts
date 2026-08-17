// eslint-disable-next-line @typescript-eslint/ban-ts-comment -- Preserve the approved engine without type-driven algorithm changes.
// @ts-nocheck -- exact approved Avatar Lab engine; validated at the typed adapter boundary.
/**
 * SVG avatar player — readable replacement for the exported runtime's minified
 * "browser runtime" string. Mounts an <svg> into a host element and drives it:
 * steps through an animation's expression presets, interpolates poses and
 * colors, schedules randomized blinks, and applies ambient eye/body motion.
 *
 * Geometry math lives in ./geometry (with ./surfaces, ./ambientMotion); this
 * module only owns DOM, timing, and playback state.
 *
 * Source: bible-strong-avatar-lab `proceduralBrowserRuntime.ts`, de-globalized
 * (engine calls import from ./geometry instead of a global, avatar data is a
 * parameter instead of an inlined DATA constant) and typed at the boundary.
 */
import {
  expressionFields,
  poseFromExpression,
  renderAvatar,
  type Expression,
} from './geometry'
import {
  ambientBodyOffset,
  ambientEyeOffset,
  applyAmbientBodyMotion,
  hasAmbientMotion,
} from './ambientMotion'
import type { SurfaceConfig } from './surfaces'
import type { BodyNode } from './body'

type ColorOverrides = { bodyColor?: string; eyeColor?: string }

export type PlayerExpression = Expression & ColorOverrides

export type PlayerBlink = {
  enabled: boolean
  initialDelayMs: number
  minIntervalMs: number
  maxIntervalMs: number
  durationMs: number
}

export type PlayerStep = {
  expressionId: string
  holdMs: number
  transitionMs: number
  transition: 'smooth' | 'snappy' | 'elastic'
}

export type PlayerAnimation = {
  name: string
  description?: string
  playbackMode: 'loop' | 'once' | 'pingPong'
  blink: PlayerBlink
  steps: PlayerStep[]
}

export type PlayerAvatarData<Name extends string = string> = {
  version: number
  avatar: {
    name: string
    surface: SurfaceConfig
    bodyNodes: BodyNode[]
    colors: { body: string; eyes: string }
  }
  expressions: Record<string, PlayerExpression>
  animations: Record<Name, PlayerAnimation>
}

export type MountOptions<Name extends string = string> = {
  animation?: Name
  autoplay?: boolean
  colors?: { body: string; eyes: string }
  loop?: boolean
  size?: number | string
  onAnimationEnd?: (animation: Name) => void
}


const SVG_NS = 'http://www.w3.org/2000/svg';
const avatarInstanceId = () => typeof globalThis.crypto?.randomUUID === 'function'
  ? globalThis.crypto.randomUUID()
  : Date.now().toString(36) + '-' + Math.random().toString(36).slice(2);
const clamp01 = (value: number) => Math.max(0, Math.min(1, value));
const easeProgress = (progress: number, transition: PlayerStep['transition']) => transition === 'smooth'
  ? progress * progress * (3 - 2 * progress)
  : transition === 'snappy'
    ? 1 - (1 - progress) ** 3
    : 1 - Math.exp(-6 * progress) * Math.cos(8 * progress);
const nearestAngle = (target: number, current: number): number => {
  let resolved = target;
  while (resolved - current > 180) resolved -= 360;
  while (resolved - current < -180) resolved += 360;
  return resolved;
};
const resolvedTargetExpression = (target: PlayerExpression, current: Expression): PlayerExpression => ({
  ...target,
  headX: nearestAngle(target.headX, current.headX),
  headY: nearestAngle(target.headY, current.headY),
  headZ: nearestAngle(target.headZ, current.headZ),
  leftAngle: nearestAngle(target.leftAngle, current.leftAngle),
  rightAngle: nearestAngle(target.rightAngle, current.rightAngle),
});
const colorChannels = (color: string) => {
  const value = color.replace('#', '');
  const hex = value.length === 3 ? value.split('').map((channel: string) => channel + channel).join('') : value;
  const numeric = Number.parseInt(hex, 16);
  return [(numeric >> 16) & 255, (numeric >> 8) & 255, numeric & 255];
};
const interpolateColor = (from: string, to: string, progress: number) => {
  const left = colorChannels(from);
  const right = colorChannels(to);
  const value = left.map((channel, index) => Math.round(channel + ((right[index] as number) - channel) * progress));
  return '#' + value.map(channel => channel.toString(16).padStart(2, '0')).join('');
};
const svgElement = <K extends keyof SVGElementTagNameMap>(name: K) =>
  document.createElementNS(SVG_NS, name) as SVGElementTagNameMap[K]


export function mountAvatar<Name extends string>(
  data: PlayerAvatarData<Name>,
  target: HTMLElement | string,
  options: MountOptions<Name> = {}
) {
  const baseColors = options.colors ?? data.avatar.colors;
  const resolveColors = (expression: Expression & ColorOverrides) => ({
    body: expression.bodyColor || baseColors.body,
    eyes: expression.eyeColor || baseColors.eyes,
  })
  const host = typeof target === 'string' ? document.querySelector(target) : target;
  if (!host) throw new Error('Avatar target was not found.');
  const animationNames = Object.keys(data.animations) as Name[];
  if (!animationNames.length) throw new Error('The avatar export contains no animations.');
  const instanceId = avatarInstanceId();
  const clipId = 'avatar-procedural-clip-' + instanceId;
  const svg = svgElement('svg');
  svg.setAttribute('viewBox', '-150 -150 300 300');
  svg.setAttribute('role', 'img');
  svg.setAttribute('aria-label', data.avatar.name);
  svg.style.width = typeof options.size === 'number' ? options.size + 'px' : options.size || '100%';
  svg.style.height = typeof options.size === 'number' ? options.size + 'px' : options.size || '100%';
  svg.style.display = 'block';
  svg.style.overflow = 'visible';
  const defs = svgElement('defs');
  const clipPath = svgElement('clipPath');
  const clipHead = svgElement('path');
  clipPath.id = clipId;
  clipPath.append(clipHead);
  defs.append(clipPath);
  svg.append(defs);
  const motionLayer = svgElement('g');
  const backLayer = svgElement('g');
  const head = svgElement('path');
  const eyesLayer = svgElement('g');
  const leftEye = svgElement('path');
  const rightEye = svgElement('path');
  const frontLayer = svgElement('g');
  eyesLayer.setAttribute('clip-path', 'url(#' + clipId + ')');
  eyesLayer.append(leftEye, rightEye);
  motionLayer.append(backLayer, head, eyesLayer, frontLayer);
  svg.append(motionLayer);
  host.replaceChildren(svg);

  const ensurePaths = (group: SVGGElement, paths: string[], fill: string) => {
    while (group.children.length < paths.length) group.append(svgElement('path'));
    while (group.children.length > paths.length) group.lastElementChild!.remove();
    paths.forEach((path: string, index: number) => {
      group.children[index]!.setAttribute('d', path);
      group.children[index]!.setAttribute('fill', fill);
    });
  };
  const firstAnimation = animationNames[0]
  if (!firstAnimation) throw new Error('The avatar export contains no animations.');
  let currentAnimation: Name = options.animation && data.animations[options.animation] ? options.animation : firstAnimation;
  const initialStep = data.animations[currentAnimation].steps[0];
  const initialExpression = data.expressions[initialStep.expressionId];
  type Pose = ReturnType<typeof poseFromExpression>
  type Colors = { body: string; eyes: string }
  type TransitionState = {
    fromPose: Pose
    toPose: Pose
    fromColors: Colors
    toColors: Colors
    startedAt: number
    durationMs: number
    transition: PlayerStep['transition']
    expressionId: string
  }
  type BlinkState = { startedAt: number; durationMs: number }
  let currentPose = poseFromExpression(initialExpression);
  let currentColors = resolveColors(initialExpression);
  let blinkAmount = 1;
  let transitionState: TransitionState | null = null;
  let blinkState: BlinkState | null = null;
  let frameRequest: number | null = null;
  let stepTimer: ReturnType<typeof setTimeout> | null = null;
  let blinkTimer: ReturnType<typeof setTimeout> | null = null;
  let blinkDueAt: number | null = null;
  let stepIndex = 0;
  let direction = 1;
  let playing = false;
  let paused = false;
  let pausedRemainingMs = 0;
  let pausedTransition: { expressionId: string; durationMs: number; transition: PlayerStep['transition'] } | null = null;
  let pausedBlink: { progress: number; durationMs: number } | null = null;
  let pausedBlinkDelay = 0;
  let stepDueAt: number | null = null;
  let eyeAmbientStartedAt = performance.now();
  let bodyAmbientStartedAt = performance.now();
  let eyeAmbientSignature = initialExpression.eyeMotion;
  let bodyAmbientSignature = initialExpression.bodyMotion;
  let ambientStrength = 1;
  let lastAmbientFrame = 0;

  const applyMotion = (expression: Expression) => {
    const now = performance.now();
    if (expression.eyeMotion !== eyeAmbientSignature) {
      eyeAmbientSignature = expression.eyeMotion;
      eyeAmbientStartedAt = now;
    }
    if (expression.bodyMotion !== bodyAmbientSignature) {
      bodyAmbientSignature = expression.bodyMotion;
      bodyAmbientStartedAt = now;
    }
  };
  const render = (time = performance.now()) => {
    const eyeElapsed = time - eyeAmbientStartedAt;
    const bodyElapsed = time - bodyAmbientStartedAt;
    const expression = currentPose.expression.bodyMotion !== 'none'
      ? applyAmbientBodyMotion(currentPose.expression, bodyElapsed, ambientStrength)
      : currentPose.expression;
    const eyeOffset = ambientEyeOffset(currentPose.expression, eyeElapsed, ambientStrength);
    const renderedPose = poseFromExpression(expression);
    const geometry = renderAvatar(renderedPose, data.avatar.surface, blinkAmount, {
      includeWire: false,
      bodyNodes: data.avatar.bodyNodes,
      eyeOffset,
    });
    const offset = ambientBodyOffset(currentPose.expression, bodyElapsed, ambientStrength);
    motionLayer.setAttribute('transform', 'translate(' + offset.x + ' ' + offset.y + ')');
    ensurePaths(backLayer, geometry.backPaths, currentColors.body);
    ensurePaths(frontLayer, geometry.frontPaths, currentColors.body);
    head.setAttribute('d', geometry.headPath);
    head.setAttribute('fill', currentColors.body);
    clipHead.setAttribute('d', geometry.headPath);
    leftEye.setAttribute('d', geometry.leftPath);
    rightEye.setAttribute('d', geometry.rightPath);
    leftEye.setAttribute('fill', currentColors.eyes);
    rightEye.setAttribute('fill', currentColors.eyes);
    leftEye.style.display = geometry.leftVisible ? '' : 'none';
    rightEye.style.display = geometry.rightVisible ? '' : 'none';
  };
  const tick = (time: number) => {
    frameRequest = null;
    if (transitionState) {
      const transition = transitionState;
      const linear = clamp01((time - transition.startedAt) / transition.durationMs);
      const eased = easeProgress(linear, transition.transition);
      ambientStrength = clamp01(eased);
      const expression = { ...transition.fromPose.expression };
      expressionFields.forEach(field => {
        expression[field] = transition.fromPose.expression[field] +
          (transition.toPose.expression[field] - transition.fromPose.expression[field]) * eased;
      });
      expression.eyeMotion = transitionState.toPose.expression.eyeMotion;
      expression.bodyMotion = transitionState.toPose.expression.bodyMotion;
      currentPose = poseFromExpression(expression);
      currentColors = {
        body: interpolateColor(transition.fromColors.body, transition.toColors.body, clamp01(eased)),
        eyes: interpolateColor(transition.fromColors.eyes, transition.toColors.eyes, clamp01(eased)),
      };
      if (linear >= 1) {
        currentPose = transition.toPose;
        currentColors = transition.toColors;
        transitionState = null;
        ambientStrength = 1;
      }
    }
    if (blinkState) {
      const progress = clamp01((time - blinkState.startedAt) / blinkState.durationMs);
      if (progress <= 0.42) {
        const closeProgress = progress / 0.42;
        blinkAmount = 1 - closeProgress * closeProgress;
      } else {
        const openProgress = (progress - 0.42) / 0.58;
        blinkAmount = 1 - (1 - openProgress) ** 2;
      }
      if (progress >= 1) {
        blinkAmount = 1;
        blinkState = null;
      }
    }
    const ambientActive = hasAmbientMotion(currentPose.expression);
    if (transitionState || blinkState || !ambientActive || time - lastAmbientFrame >= 1000 / 30) {
      render(time);
      if (ambientActive) lastAmbientFrame = time;
    }
    if (transitionState || blinkState || ambientActive) frameRequest = requestAnimationFrame(tick);
  };
  const requestTick = () => {
    if (frameRequest === null) frameRequest = requestAnimationFrame(tick);
  };
  const animateTo = (expressionId: string, durationMs: number, transition: PlayerStep['transition']) => {
    const target = data.expressions[expressionId];
    if (!target) return;
    applyMotion(target);
    const resolved = resolvedTargetExpression(target, currentPose.expression);
    const targetPose = poseFromExpression(resolved);
    const targetColors = resolveColors(target);
    if (durationMs <= 0) {
      ambientStrength = 1;
      transitionState = null;
      currentPose = targetPose;
      currentColors = targetColors;
      render();
      if (hasAmbientMotion(currentPose.expression)) requestTick();
      return;
    }
    transitionState = {
      fromPose: currentPose,
      toPose: targetPose,
      fromColors: currentColors,
      toColors: targetColors,
      startedAt: performance.now(),
      durationMs,
      transition,
      expressionId,
    };
    ambientStrength = 0;
    requestTick();
  };
  const clearSchedule = () => {
    if (stepTimer !== null) clearTimeout(stepTimer);
    if (blinkTimer !== null) clearTimeout(blinkTimer);
    stepTimer = null;
    blinkTimer = null;
    blinkDueAt = null;
    stepDueAt = null;
  };
  const scheduleBlink = (animation: PlayerAnimation, delay: number) => {
    if (!animation.blink.enabled) return;
    blinkDueAt = performance.now() + delay;
    blinkTimer = setTimeout(() => {
      blinkDueAt = null;
      blinkState = { startedAt: performance.now(), durationMs: animation.blink.durationMs };
      requestTick();
      const range = animation.blink.maxIntervalMs - animation.blink.minIntervalMs;
      scheduleBlink(animation, animation.blink.durationMs + animation.blink.minIntervalMs + Math.random() * range);
    }, delay);
  };
  const advance = (animation: PlayerAnimation) => {
    const last = animation.steps.length - 1;
    const playbackMode = options.loop === true ? 'loop' : options.loop === false ? 'once' : animation.playbackMode;
    if (playbackMode === 'once' && stepIndex >= last) {
      playing = false;
      options.onAnimationEnd?.(currentAnimation);
      return;
    }
    if (playbackMode === 'pingPong' && last > 0) {
      if (stepIndex >= last) direction = -1;
      else if (stepIndex <= 0) direction = 1;
      stepIndex += direction;
    } else stepIndex = (stepIndex + 1) % (last + 1);
    runStep(animation);
  };
  const runStep = (animation: PlayerAnimation) => {
    if (!playing || !animation.steps.length) return;
    const step = animation.steps[stepIndex];
    animateTo(step.expressionId, step.transitionMs, step.transition);
    const duration = step.transitionMs + step.holdMs;
    stepDueAt = performance.now() + duration;
    stepTimer = setTimeout(() => advance(animation), duration);
  };
  const api = {
    element: svg,
    get animation() { return currentAnimation; },
    get playing() { return playing; },
    play(animationName?: Name) {
      const nextAnimation: Name = animationName ?? currentAnimation;
      if (!data.animations[nextAnimation]) throw new Error('Unknown animation: ' + nextAnimation);
      clearSchedule();
      if (nextAnimation === currentAnimation && paused) {
        paused = false;
        playing = true;
        if (pausedTransition) animateTo(pausedTransition.expressionId, pausedTransition.durationMs, pausedTransition.transition);
        if (pausedBlink) {
          blinkState = {
            startedAt: performance.now() - pausedBlink.progress * pausedBlink.durationMs,
            durationMs: pausedBlink.durationMs,
          };
          requestTick();
        }
        stepDueAt = performance.now() + pausedRemainingMs;
        stepTimer = setTimeout(() => advance(data.animations[currentAnimation]), pausedRemainingMs);
        scheduleBlink(
          data.animations[currentAnimation],
          pausedBlinkDelay || data.animations[currentAnimation].blink.minIntervalMs
        );
        pausedTransition = null;
        pausedBlink = null;
        pausedBlinkDelay = 0;
        return api;
      }
      currentAnimation = nextAnimation;
      stepIndex = 0;
      direction = 1;
      paused = false;
      playing = true;
      runStep(data.animations[currentAnimation]);
      scheduleBlink(data.animations[currentAnimation], data.animations[currentAnimation].blink.initialDelayMs);
      return api;
    },
    pause() {
      const now = performance.now();
      if (playing && stepDueAt !== null) pausedRemainingMs = Math.max(stepDueAt - now, 0);
      pausedBlinkDelay = blinkDueAt === null ? 0 : Math.max(blinkDueAt - now, 0);
      if (transitionState) {
        const elapsed = now - transitionState.startedAt;
        pausedTransition = {
          expressionId: transitionState.expressionId,
          durationMs: Math.max(transitionState.durationMs - elapsed, 0),
          transition: transitionState.transition,
        };
      }
      if (blinkState) {
        pausedBlink = {
          progress: clamp01((now - blinkState.startedAt) / blinkState.durationMs),
          durationMs: blinkState.durationMs,
        };
      }
      clearSchedule();
      transitionState = null;
      blinkState = null;
      paused = true;
      playing = false;
      render();
      return api;
    },
    stop() {
      clearSchedule();
      transitionState = null;
      blinkState = null;
      blinkAmount = 1;
      pausedBlink = null;
      pausedBlinkDelay = 0;
      paused = false;
      playing = false;
      stepIndex = 0;
      direction = 1;
      const first = data.animations[currentAnimation].steps[0];
      if (first) animateTo(first.expressionId, 0, first.transition);
      return api;
    },
    destroy() {
      clearSchedule();
      if (frameRequest !== null) cancelAnimationFrame(frameRequest);
      svg.remove();
    },
  };
  applyMotion(initialExpression);
  render();
  if (hasAmbientMotion(initialExpression)) requestTick();
  if (options.autoplay !== false) api.play(currentAnimation);
  return api;
}
