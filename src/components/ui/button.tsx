import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import type { ComponentProps } from "react";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-full font-medium transition-colors whitespace-nowrap cursor-pointer",
  {
    variants: {
      variant: {
        primary: "bg-ink text-on-ink hover:bg-ink/90",
        outline: "border border-strong text-ink hover:border-ink/50",
        ghost: "text-ink hover:text-ink",
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
