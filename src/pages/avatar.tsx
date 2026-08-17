import { useState } from "react";
import { BotoBot } from "@/avatar/BotoBot";
import { Bot3D, ANIMATION_NAMES, type AnimationName } from "@/avatar/lab3d/Bot3D";
import type { StateId } from "@/avatar/core/states";
import { SHAPES, COLORS } from "@/avatar/core/skins";
import { cn } from "@/lib/utils";

/**
 * Avatar lab — mirrors the app's hybrid renderer: the 3D Avatar Lab engine
 * owns every resting mood, and the 2D morph engine takes over when the body
 * stops being a body. Selecting a mood shows 3D; selecting a morph cross-fades
 * to the 2D layer, exactly like BotAvatarMorph in the app.
 */

const MOOD_LABELS: Record<string, string> = {
  idle: "Idle",
  happy: "Happy",
  thinking: "Thinking",
  working: "Working",
  sleeping: "Sleeping",
  error: "Error",
  listening: "Listening",
  curious: "Curious",
  notify: "Notify",
  wink: "Wink",
};

const MORPHS: { id: StateId; label: string }[] = [
  { id: "hibernate" as StateId, label: "Hibernate" },
  { id: "fork" as StateId, label: "Fork" },
  { id: "thinking" as StateId, label: "Dots" },
  { id: "orbit" as StateId, label: "Orbit" },
  { id: "burst" as StateId, label: "Burst" },
  { id: "comet" as StateId, label: "Comet" },
];

const SHAPE_LABELS: Record<string, string> = {
  cercle: "Circle",
  galet: "Pebble",
  squircle: "Squircle",
  capsule: "Capsule",
  triangle: "Triangle",
  hexagone: "Hexagon",
  nuage: "Cloud",
  goutte: "Droplet",
};

const COLOR_LABELS: Record<string, string> = {
  encre: "Ink",
  creme: "Cream",
  brun: "Brown",
  rouge: "Red",
  orange: "Orange",
  ambre: "Amber",
  vert: "Green",
  turquoise: "Turquoise",
  bleu: "Blue",
  violet: "Purple",
  rose: "Pink",
  gris: "Grey",
};

function Chip({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "cursor-pointer rounded-full px-4 py-2.5 text-sm font-medium transition-colors",
        active ? "bg-white text-ground" : "border border-white/18 text-white/75 hover:border-white/40",
      )}
    >
      {children}
    </button>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="flex flex-col gap-3">
      <h2 className="text-xs font-semibold tracking-widest text-white/40 uppercase">{title}</h2>
      <div className="flex flex-wrap gap-2">{children}</div>
    </section>
  );
}

const FADE_MS = 180;

export function AvatarPage() {
  const [mood, setMood] = useState<AnimationName>("idle");
  const [morph, setMorph] = useState<StateId | null>(null);
  const [shape, setShape] = useState("squircle");
  const [colorId, setColorId] = useState("creme");

  const hex = COLORS.find((c) => c.id === colorId)?.hex ?? "#f1efe9";
  const morphing = morph !== null;

  const layer = (visible: boolean): React.CSSProperties => ({
    gridArea: "1 / 1",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    opacity: visible ? 1 : 0,
    transition: `opacity ${FADE_MS}ms ease`,
    pointerEvents: "none",
  });

  return (
    <div className="mx-auto flex max-w-240 flex-col gap-8 px-6 pt-10 pb-24">
      <header className="flex flex-col gap-1.5">
        <h1 className="font-display text-4xl font-medium tracking-tight">Avatar lab</h1>
        <p className="text-[15px] text-white/55">
          The app's hybrid renderer: moods play in the 3D Avatar Lab engine — quaternion head turns, perspective body —
          and body morphs cross-fade to the 2D engine (adapted from{" "}
          <a href="https://github.com/jeremy-prt/bloub" className="text-accent-light underline">
            bloub
          </a>
          , MIT).
        </p>
      </header>

      {/* Stage: both engines stacked, swapping under the same fade as the app. */}
      <div className="sticky top-18 z-10 -mx-6 grid place-items-center bg-ground/92 py-4 backdrop-blur">
        <span style={{ display: "inline-grid", width: 280, height: 280 }}>
          <span style={layer(!morphing)}>
            <Bot3D animation={mood} size={280} colors={{ body: hex, eyes: "#0A0A0B" }} />
          </span>
          <span style={layer(morphing)}>
            {morphing && (
              <BotoBot state={morph} motion={null} shape={shape} color={hex} paper="#0A0A0B" follow size={280} />
            )}
          </span>
        </span>
      </div>

      <Section title="Mood — 3D engine, Botto's presence animations">
        {ANIMATION_NAMES.map((name) => (
          <Chip
            key={name}
            active={!morphing && mood === name}
            onClick={() => {
              setMorph(null);
              setMood(name);
            }}
          >
            {MOOD_LABELS[name] ?? name}
          </Chip>
        ))}
      </Section>

      <Section title="Morph — 2D engine, body states">
        {MORPHS.map((s) => (
          <Chip key={s.id} active={morph === s.id} onClick={() => setMorph(morph === s.id ? null : s.id)}>
            {s.label}
          </Chip>
        ))}
      </Section>

      <Section title="Shape (morph layer)">
        {SHAPES.map((s) => (
          <Chip key={s.id} active={shape === s.id} onClick={() => setShape(s.id)}>
            {SHAPE_LABELS[s.id] ?? s.id}
          </Chip>
        ))}
      </Section>

      <Section title="Colour">
        {COLORS.map((c) => (
          <button
            key={c.id}
            type="button"
            aria-label={COLOR_LABELS[c.id] ?? c.id}
            onClick={() => setColorId(c.id)}
            className={cn(
              "size-10 cursor-pointer rounded-full border-2 transition-transform",
              colorId === c.id ? "scale-110 border-white" : "border-white/15",
            )}
            style={{ backgroundColor: c.hex }}
          />
        ))}
      </Section>

      <p className="text-[13px] leading-relaxed text-white/40">
        Tap a mood to watch the 3D engine (head turns in perspective, ambient drift, blinks). Tap a morph to cross-fade
        into the 2D body-morph layer — tap it again to release back to 3D, the same 180ms swap the app uses for
        hibernating Bots. Everything here is the exact code running in the desktop app.
      </p>
    </div>
  );
}
