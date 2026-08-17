import { useMemo, useState, type CSSProperties } from "react";
import { BotoBot } from "./BotoBot";
import { Bot3D, type AnimationName } from "./lab3d/Bot3D";
import type { StateId } from "./core/states";

/**
 * The one Botto renderer.
 *
 * Internally it drives two engines — the Avatar Lab 3D engine (quaternion head
 * turns, perspective body) for every resting mood, and the 2D morph engine for
 * states where the body stops being a body (hibernate, fork, dots, orbit,
 * burst, comet) — but that is an implementation detail. Consumers set `mood`
 * and optionally `morph`; the renderer swaps layers under a 180ms cross-fade,
 * the same hand-off the desktop app uses.
 */
export type BottoMood = AnimationName;
export type BottoMorph = "hibernate" | "fork" | "thinking" | "orbit" | "burst" | "comet";
/** Body shapes supported by BOTH engines. */
export type BottoShape = "squircle" | "cercle" | "galet" | "capsule" | "triangle";

export const BOTTO_SHAPES: BottoShape[] = ["squircle", "cercle", "galet", "capsule", "triangle"];
export const BOTTO_MORPHS: BottoMorph[] = ["hibernate", "fork", "thinking", "orbit", "burst", "comet"];

export interface BottoAvatarProps {
  /** Resting animation, played by the 3D engine. */
  mood?: BottoMood;
  /** Body-morph state; while set, the 2D layer is shown. */
  morph?: BottoMorph | null;
  shape?: BottoShape;
  size?: number;
  /** Body color (hex). */
  ink?: string;
  /** Background behind the avatar (eye backfill + particle depth fog). */
  paper?: string;
  /** 2D layer's gaze follows the pointer (desktop only). */
  follow?: boolean;
  className?: string;
  label?: string;
}

const FADE_MS = 180;

export function BottoAvatar({
  mood = "idle",
  morph = null,
  shape = "squircle",
  size = 280,
  ink = "#F1EFE9",
  paper = "#0A0A0B",
  follow = false,
  className,
  label = "Botto",
}: BottoAvatarProps) {
  const morphing = morph !== null;
  // The 2D layer stays mounted through fade-out so the swap back is seamless.
  const [lastMorph, setLastMorph] = useState<BottoMorph | null>(morph);
  if (morph !== null && morph !== lastMorph) setLastMorph(morph);

  const layer = useMemo(
    () =>
      (visible: boolean): CSSProperties => ({
        gridArea: "1 / 1",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        opacity: visible ? 1 : 0,
        transition: `opacity ${FADE_MS}ms ease`,
        pointerEvents: "none",
      }),
    [],
  );

  return (
    <span
      aria-label={label}
      className={className}
      role="img"
      style={{ display: "inline-grid", width: size, height: size }}
    >
      <span style={layer(!morphing)}>
        <Bot3D animation={mood} shape={shape} size={size} colors={{ body: ink, eyes: paper }} label="" />
      </span>
      <span style={layer(morphing)}>
        {lastMorph ? (
          <BotoBot
            size={size}
            state={lastMorph as StateId}
            motion={null}
            shape={shape}
            color={ink}
            paper={paper}
            follow={follow && morphing}
          />
        ) : null}
      </span>
    </span>
  );
}
