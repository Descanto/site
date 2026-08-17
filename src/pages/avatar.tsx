import { useState } from "react";
import { BotoBot } from "@/avatar/BotoBot";
import { STATES, type StateId } from "@/avatar/core/states";
import { SHAPES } from "@/avatar/core/skins";
import { COLORS } from "@/avatar/core/skins";
import { EXPRESSIONS } from "@/avatar/core/expressions";
import { cn } from "@/lib/utils";

const STATE_LABELS: Record<string, string> = {
  idle: "Idle",
  thinking: "Thinking",
  wink: "Wink",
  wide: "Wide eyes",
  alert: "Alert",
  notification: "Notification",
  exclamation: "Exclamation",
  sleep: "Sleep",
  egg: "Egg",
  hexagon: "Hexagon",
  play: "Play",
  orbit: "Orbit",
  burst: "Burst",
  comet: "Comet",
};

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

const EXPRESSION_LABELS: Record<string, string> = {
  neutre: "Neutral",
  attentif: "Attentive",
  surpris: "Surprised",
  excite: "Excited",
  heureux: "Happy",
  hilare: "Laughing",
  colere: "Angry",
  triste: "Sad",
  effraye: "Scared",
  mefiant: "Suspicious",
  confus: "Confused",
  curieux: "Curious",
  fier: "Proud",
  timide: "Shy",
  blase: "Unimpressed",
  somnolent: "Sleepy",
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
  const [shape, setShape] = useState("cercle");
  const [expression, setExpression] = useState("neutre");
  const [color, setColor] = useState("creme");

  return (
    <div className="mx-auto flex max-w-240 flex-col gap-8 px-6 pt-10 pb-24">
      <header className="flex flex-col gap-1.5">
        <h1 className="font-display text-4xl font-medium tracking-tight">Avatar lab</h1>
        <p className="text-[15px] text-white/55">
          The extended Botto avatar — morphing body, décor, and gaze. Engine ported from{" "}
          <a href="https://github.com/jeremy-prt/bloub" className="text-accent-light underline">
            bloub
          </a>{" "}
          (MIT), measured off the x.ai reference frame by frame.
        </p>
      </header>

      {/* Stage: sticky on mobile so the bot stays visible while scrolling the pickers */}
      <div className="sticky top-18 z-10 -mx-6 flex items-center justify-center bg-ground/92 py-4 backdrop-blur">
        <BotoBot state={state} shape={shape} expression={expression} color={color} paper="#0A0A0B" follow size={280} />
      </div>

      <Section title="Animation">
        {STATES.map((s) => (
          <Chip key={s.id} active={state === s.id} onClick={() => setState(s.id)}>
            {STATE_LABELS[s.id] ?? s.id}
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

      <Section title="Expression">
        {EXPRESSIONS.map((e) => (
          <Chip key={e.id} active={expression === e.id} onClick={() => setExpression(e.id)}>
            {EXPRESSION_LABELS[e.id] ?? e.id}
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
        Move your cursor to steer the gaze on desktop. On touch, gaze rests. The engine is pure TypeScript
        (`src/avatar/core`) — a function of time with no framework dependency, ready to port into the Botto app.
      </p>
    </div>
  );
}
