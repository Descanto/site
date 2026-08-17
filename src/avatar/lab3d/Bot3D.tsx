import { useEffect, useRef } from "react";
import { loadAvatarRuntime, type RuntimeAvatar } from "./avatar-runtime";
import { avatarData, type AnimationName } from "./botto.avatar";

/**
 * React mount for the Avatar Lab 3D engine (vendored from the Botto app;
 * upstream bible-strong-avatar-lab, MIT). Quaternion head turns, perspective
 * body, ambient drift and blinks — the signature Botto look.
 */
export interface Bot3DProps {
  animation?: AnimationName;
  size?: number;
  colors?: { body: string; eyes: string };
  className?: string;
  label?: string;
}

export function Bot3D({ animation = "idle", size = 280, colors, className, label = "Botto" }: Bot3DProps) {
  const host = useRef<HTMLDivElement>(null);
  const avatar = useRef<RuntimeAvatar<AnimationName> | null>(null);
  const current = useRef<AnimationName>(animation);
  current.current = animation;

  useEffect(() => {
    let disposed = false;
    if (!host.current) return undefined;
    const reduced = globalThis.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;
    void loadAvatarRuntime(avatarData).then((runtime) => {
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
  }, [colors?.body, colors?.eyes, size]);

  useEffect(() => {
    avatar.current?.play(animation);
  }, [animation]);

  return <div aria-label={label} className={className} ref={host} role="img" style={{ height: size, width: size }} />;
}

export const ANIMATION_NAMES = Object.keys(avatarData.animations) as AnimationName[];
export type { AnimationName };
