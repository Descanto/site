import { useState } from "react";
import { BotoBot } from "@/avatar/BotoBot";
import { MOTIONS } from "@/avatar/botto";
import type { StateId } from "@/avatar/core/states";
import { SHAPES } from "@/avatar/core/skins";
import { COLORS } from "@/avatar/core/skins";
import { cn } from "@/lib/utils";

/** Botto's own morph states (botto.ts) + the generic engine capabilities we keep. */
const MORPHS: { id: StateId; label: string }[] = [
  { id: "idle" as StateId, label: "Rest" },
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

export function AvatarPage() {
  const [state, setState] = useState<StateId>("idle");
  const [motionId, setMotionId] = useState("idle");
  const [shape, setShape] = useState("squircle");
  const [color, setColor] = useState("creme");

  return (
    <div className="mx-auto flex max-w-240 flex-col gap-8 px-6 pt-10 pb-24">
      <header className="flex flex-col gap-1.5">
        <h1 className="font-display text-4xl font-medium tracking-tight">Avatar lab</h1>
        <p className="text-[15px] text-white/55">
          Botto's animation set — presence moods from the app, plus body morphs for Canto states. Runs on a morphing
          engine adapted from{" "}
          <a href="https://github.com/jeremy-prt/bloub" className="text-accent-light underline">
            bloub
          </a>{" "}
          (MIT).
        </p>
      </header>

      {/* Stage: sticky on mobile so the bot stays visible while scrolling the pickers */}
      <div className="sticky top-18 z-10 -mx-6 flex items-center justify-center bg-ground/92 py-4 backdrop-blur">
        <BotoBot state={state} motion={motionId} shape={shape} color={color} paper="#0A0A0B" follow size={280} />
      </div>

      <Section title="Mood — Botto's presence animations">
        {MOTIONS.map((m) => (
          <Chip key={m.id} active={motionId === m.id} onClick={() => { setMotionId(m.id); setState("idle" as StateId); }}>
            {m.label}
          </Chip>
        ))}
      </Section>

      <Section title="Morph — body states">
        {MORPHS.map((s) => (
          <Chip key={s.id} active={state === s.id} onClick={() => setState(s.id)}>
            {s.label}
          </Chip>
        ))}
      </Section>

      <Section title="Shape">
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
            onClick={() => setColor(c.id)}
            className={cn(
              "size-10 cursor-pointer rounded-full border-2 transition-transform",
              color === c.id ? "scale-110 border-white" : "border-white/15",
            )}
            style={{ backgroundColor: c.hex }}
          />
        ))}
      </Section>

      <p className="text-[13px] leading-relaxed text-white/40">
        Moods are Botto's original presence vocabulary (idle, thinking, working, error…) ported from the app. Morphs map
        to Canto: hibernate rests the body as a breathing dot, fork slides a clone out and merges it back. Move your
        cursor to steer the gaze on desktop; on touch, gaze rests. Pure TypeScript, no framework dependency — ready to
        port back into the app.
      </p>
    </div>
  );
}
