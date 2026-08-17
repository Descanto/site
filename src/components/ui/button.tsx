import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import type { ComponentProps } from "react";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-full font-medium transition-colors whitespace-nowrap cursor-pointer",
  {
    variants: {
      variant: {
        primary: "bg-white text-ground hover:bg-white/90",
        outline: "border border-white/25 text-white hover:border-white/50",
        ghost: "text-white/85 hover:text-white",
      },
      size: {
        sm: "px-4 py-2 text-sm",
        md: "px-6 py-3 text-[15px]",
      },
    },
    defaultVariants: { variant: "primary", size: "md" },
  },
);

export function Button({
  className,
  variant,
  size,
  ...props
}: ComponentProps<"a"> & VariantProps<typeof buttonVariants>) {
  return <a className={cn(buttonVariants({ variant, size }), className)} {...props} />;
}
