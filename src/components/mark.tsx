import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

/**
 * The Descanto "d" mark from the brand kit: circle + flag stem. Ink on white
 * by default; pass invert for white on ink panels. Hover gives a small lift.
 */
export function Mark({
  size = 24,
  className,
  invert = false,
  animate = true,
}: {
  size?: number;
  className?: string;
  invert?: boolean;
  animate?: boolean;
}) {
  const reduced = useReducedMotion();
  // invert is for dark panels, which stay dark in both themes — always white there.
  const fill = invert ? "#FFFFFF" : "var(--color-ink)";
  return (
    <motion.svg
      viewBox="0 0 48 48"
      width={size}
      height={size}
      className={cn("shrink-0", className)}
      whileHover={animate && !reduced ? { scale: 1.06, rotate: -3 } : undefined}
      transition={{ type: "spring", stiffness: 300, damping: 18 }}
    >
      <circle cx="21.5" cy="29" r="9.5" fill="none" stroke={fill} strokeWidth="7" />
      <polygon points="31,14.5 38,8 38,40 31,40" fill={fill} />
    </motion.svg>
  );
}
