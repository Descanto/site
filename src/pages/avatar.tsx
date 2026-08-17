import { useState } from "react";
import {
  BottoAvatar,
  BOTTO_MORPHS,
  BOTTO_SHAPES,
  type BottoMood,
  type BottoMorph,
  type BottoShape,
} from "@/avatar/BottoAvatar";
import { ANIMATION_NAMES } from "@/avatar/lab3d/Bot3D";
import { COLORS } from "@/avatar/core/skins";
import { cn } from "@/lib/utils";

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

const MORPH_LABELS: Record<BottoMorph, string> = {
  hibernate: "Hibernate",
  fork: "Fork",
  thinking: "Dots",
  orbit: "Orbit",
  burst: "Burst",
  comet: "Comet",
};

const SHAPE_LABELS: Record<BottoShape, string> = {
  squircle: "Squircle",
  cercle: "Circle",
  galet: "Pebble",
  capsule: "Capsule",
  triangle: "Triangle",
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
  const [mood, setMood] = useState<BottoMood>("idle");
  const [morph, setMorph] = useState<BottoMorph | null>(null);
  const [shape, setShape] = useState<BottoShape>("squircle");
  const [colorId, setColorId] = useState("creme");

  const hex = COLORS.find((c) => c.id === colorId)?.hex ?? "#f1efe9";

  return (
    <div className="mx-auto flex max-w-240 flex-col gap-8 px-6 pt-10 pb-24">
      <header className="flex flex-col gap-1.5">
        <h1 className="font-display text-4xl font-medium tracking-tight">Avatar lab</h1>
        <p className="text-[15px] text-white/55">
          One renderer, Botto's full range: moods play in 3D — head turning in perspective — and body morphs take over
          when the body stops being a body. Morph engine adapted from{" "}
          <a href="https://github.com/jeremy-prt/bloub" className="text-accent-light underline">
            bloub
          </a>{" "}
          (MIT).
        </p>
      </header>

      {/* Stage: sticky on mobile so the bot stays visible while scrolling the pickers */}
      <div className="sticky top-18 z-10 -mx-6 grid place-items-center bg-ground/92 py-4 backdrop-blur">
        <BottoAvatar mood={mood} morph={morph} shape={shape} ink={hex} paper="#0A0A0B" follow size={280} />
      </div>

      <Section title="Mood — presence animations">
        {ANIMATION_NAMES.map((name) => (
          <Chip
            key={name}
            active={!morph && mood === name}
            onClick={() => {
              setMorph(null);
              setMood(name);
            }}
          >
            {MOOD_LABELS[name] ?? name}
          </Chip>
        ))}
      </Section>

      <Section title="Morph — body states">
        {BOTTO_MORPHS.map((m) => (
          <Chip key={m} active={morph === m} onClick={() => setMorph(morph === m ? null : m)}>
            {MORPH_LABELS[m]}
          </Chip>
        ))}
      </Section>

      <Section title="Shape">
        {BOTTO_SHAPES.map((s) => (
          <Chip key={s} active={shape === s} onClick={() => setShape(s)}>
            {SHAPE_LABELS[s]}
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
        Shape and colour apply everywhere — pick Triangle and the 3D head still turns in perspective, then tap Hibernate
        and the same triangle settles into a breathing dot. Tap an active morph again to release back to 3D. This
        `BottoAvatar` component is the single entry point the app ports.
      </p>
    </div>
  );
}
