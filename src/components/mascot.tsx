import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";
import { BODY_PATH, EYE_LEFT, EYE_RIGHT } from "./botto-paths";

/**
 * The real Botto avatar (from bot/spikes/botto-avatar, the mascot source of truth):
 * soft ink squircle with capsule eyes. Idles with a periodic blink; hover gives a
 * small lift, like the app's presence wake.
 */
export function Mascot({
  size = 24,
  className,
  invert = true,
  animate = true,
}: {
  size?: number;
  className?: string;
  /** White body + ink eyes — the default on this dark-only site. Pass false for the app's ink body on light surfaces. */
  invert?: boolean;
  animate?: boolean;
}) {
  const reduced = useReducedMotion();
  const blink = animate && !reduced;
  const body = invert ? "#FFFFFF" : "#101319";
  const eyes = invert ? "#0A0A0B" : "#FFFFFF";

  return (
    <motion.svg
      viewBox="-150 -150 300 300"
      width={size}
      height={size}
      className={cn("shrink-0", className)}
      whileHover={animate && !reduced ? { scale: 1.06, rotate: -3 } : undefined}
      transition={{ type: "spring", stiffness: 300, damping: 18 }}
    >
      <path d={BODY_PATH} fill={body} />
      <motion.g
        style={{ transformOrigin: "6px -3px" }}
        animate={blink ? { scaleY: [1, 1, 0.08, 1, 1] } : undefined}
        transition={blink ? { duration: 4.6, times: [0, 0.9, 0.93, 0.96, 1], repeat: Infinity, ease: "easeInOut" } : undefined}
      >
        <path d={EYE_LEFT} fill={eyes} />
        <path d={EYE_RIGHT} fill={eyes} />
      </motion.g>
    </motion.svg>
  );
}
