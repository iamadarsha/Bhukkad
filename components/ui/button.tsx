import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { motion } from "motion/react";

/**
 * MD3 Button — 5 variants + FAB variants
 * https://m3.material.io/components/buttons/overview
 *
 * State layers implemented via ::after pseudo-element in globals.css (.state-layer)
 */
const buttonVariants = cva(
  [
    "inline-flex items-center justify-center gap-2 whitespace-nowrap",
    "text-label-lg font-medium tracking-[0.1px]",
    "transition-all duration-150 ease-out",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--md-sys-color-primary)] focus-visible:ring-offset-2",
    "disabled:pointer-events-none disabled:opacity-38",
    "state-layer",
  ].join(" "),
  {
    variants: {
      variant: {
        // MD3 Filled Button — primary background, pill shape
        filled:
          "bg-[var(--md-sys-color-primary)] text-[var(--md-sys-color-on-primary)] rounded-full shadow-none hover:shadow-elevation-1 active:shadow-none",
        // MD3 Filled Tonal Button — secondary-container background
        tonal:
          "bg-[var(--md-sys-color-secondary-container)] text-[var(--md-sys-color-on-secondary-container)] rounded-full shadow-none hover:shadow-elevation-1",
        // MD3 Outlined Button — transparent + border
        outlined:
          "bg-transparent border border-[var(--md-sys-color-outline)] text-[var(--md-sys-color-primary)] rounded-full",
        // MD3 Text Button — no background, no border
        text: "bg-transparent text-[var(--md-sys-color-primary)] rounded-full",
        // MD3 Elevated Button — surface + shadow
        elevated:
          "bg-[var(--md-sys-color-surface-container-low)] text-[var(--md-sys-color-primary)] rounded-full shadow-elevation-1 hover:shadow-elevation-2",
        // Legacy aliases (backward compat)
        default:
          "bg-[var(--md-sys-color-primary)] text-[var(--md-sys-color-on-primary)] rounded-full shadow-none hover:shadow-elevation-1",
        destructive:
          "bg-[var(--md-sys-color-error)] text-[var(--md-sys-color-on-error)] rounded-full",
        outline:
          "bg-transparent border border-[var(--md-sys-color-outline)] text-[var(--md-sys-color-primary)] rounded-full",
        secondary:
          "bg-[var(--md-sys-color-secondary-container)] text-[var(--md-sys-color-on-secondary-container)] rounded-full",
        ghost:
          "bg-transparent text-[var(--md-sys-color-on-surface)] rounded-full hover:bg-[color-mix(in_srgb,var(--md-sys-color-on-surface)_8%,transparent)]",
        link: "bg-transparent text-[var(--md-sys-color-primary)] underline-offset-4 hover:underline rounded-full",
      },
      size: {
        default: "h-10 px-6 py-2.5 text-label-lg",
        sm: "h-8 px-4 text-label-md",
        lg: "h-12 px-8 text-label-lg",
        icon: "h-10 w-10 rounded-full p-0",
        "icon-sm": "h-8 w-8 rounded-full p-0",
        "icon-lg": "h-12 w-12 rounded-full p-0",
        // FAB sizes
        fab: "h-14 w-14 rounded-[var(--md-sys-shape-corner-extra-large)] p-0 shadow-elevation-3 hover:shadow-elevation-4",
        "fab-sm": "h-10 w-10 rounded-[var(--md-sys-shape-corner-large)] p-0 shadow-elevation-3",
        "fab-lg": "h-24 w-24 rounded-[var(--md-sys-shape-corner-extra-large)] p-0 shadow-elevation-3",
        "fab-extended": "h-14 px-4 rounded-[var(--md-sys-shape-corner-extra-large)] shadow-elevation-3 min-w-20",
      },
    },
    defaultVariants: {
      variant: "filled",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <motion.div
        whileTap={{ scale: 0.97 }}
        transition={{ duration: 0.1 }}
        className="inline-flex"
      >
        <Comp
          className={cn(buttonVariants({ variant, size, className }))}
          ref={ref}
          {...props}
        />
      </motion.div>
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
