import { useEffect, useMemo, useRef } from "react";
import { loadAvatarRuntime, type AvatarData, type RuntimeAvatar } from "./avatar-runtime";
import { avatarData, type AnimationName } from "./botto.avatar";

/**
 * 3D bodies for the lab's shape picker: the 2D morph engine's shape ids mapped
 * onto the Avatar Lab surface primitives, sized to the approved Botto
 * proportions (the default squircle is the mascot's own 192/180/172 @ 0.85).
 */
const SURFACES: Record<string, Record<string, unknown>> = {
  squircle: { type: "cube", width: 192, height: 180, depth: 172, roundness: 0.85 },
  cercle: { type: "sphere", width: 200, height: 200, depth: 200, roundness: 1 },
  galet: { type: "cube", width: 210, height: 160, depth: 170, roundness: 1 },
  capsule: { type: "capsule", width: 165, height: 225, depth: 165, roundness: 1 },
  triangle: { type: "cone", width: 210, height: 210, depth: 190, roundness: 0, morphRoundness: 0, tipRoundness: 0.55, baseRoundness: 0.45 },
};

export const SHAPE_3D_IDS = Object.keys(SURFACES);

/**
 * React mount for the Avatar Lab 3D engine (vendored from the Botto app;
 * upstream bible-strong-avatar-lab, MIT). Quaternion head turns, perspective
 * body, ambient drift and blinks — the signature Botto look.
 */
export interface Bot3DProps {
  animation?: AnimationName;
  size?: number;
  colors?: { body: string; eyes: string };
  /** Body shape (2D-engine shape id); remounts the surface. Default: the mascot squircle. */
  shape?: string;
  className?: string;
  label?: string;
}

export function Bot3D({ animation = "idle", size = 280, colors, shape = "squircle", className, label = "Botto" }: Bot3DProps) {
  const host = useRef<HTMLDivElement>(null);
  const avatar = useRef<RuntimeAvatar<AnimationName> | null>(null);
  const current = useRef<AnimationName>(animation);
  current.current = animation;

  // The player reads the surface from avatar data at mount, so a shape change
  // swaps the data object and remounts — same lifecycle as a palette change.
  const data = useMemo<AvatarData<AnimationName>>(() => {
    const surface = SURFACES[shape] ?? SURFACES.squircle!;
    return { ...avatarData, avatar: { ...avatarData.avatar, surface } };
  }, [shape]);

  useEffect(() => {
    let disposed = false;
    if (!host.current) return undefined;
    const reduced = globalThis.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;
    void loadAvatarRuntime(data).then((runtime) => {
      if (disposed || !host.current) return;
      avatar.current = runtime.createAvatar(host.current, {
        animation: current.current,
        autoplay: !reduced,
        size,
        ...(colors ? { colors } : {}),
        onAnimationEnd: () => {
          // Keep looping whatever the page selected; one-shots restart too so
          // the lab can inspect them repeatedly.
          avatar.current?.play(current.current);
        },
      });
      if (reduced) avatar.current.pause();
    });
    return () => {
      disposed = true;
      avatar.current?.destroy();
      avatar.current = null;
    };
  }, [colors?.body, colors?.eyes, size, data]);

  useEffect(() => {
    avatar.current?.play(animation);
  }, [animation]);

  return <div aria-label={label} className={className} ref={host} role="img" style={{ height: size, width: size }} />;
}

export const ANIMATION_NAMES = Object.keys(avatarData.animations) as AnimationName[];
export type { AnimationName };
