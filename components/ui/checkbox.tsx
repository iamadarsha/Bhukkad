import * as React from "react"
import * as CheckboxPrimitive from "@radix-ui/react-checkbox"
import { cn } from "@/lib/utils"

/**
 * MD3 Checkbox
 * https://m3.material.io/components/checkbox/overview
 *
 * - Unchecked: 2px border on-surface-variant, transparent fill, shape 2px
 * - Checked: primary background, on-primary checkmark
 * - Indeterminate: primary background, on-primary dash
 * - State layer: 40px touch target via ring offset
 */

const Checkbox = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>
>(({ className, ...props }, ref) => (
  <CheckboxPrimitive.Root
    ref={ref}
    className={cn(
      "peer h-[18px] w-[18px] shrink-0",
      "rounded-[2px]",
      "border-2 border-[var(--md-sys-color-on-surface-variant)]",
      "bg-transparent",
      "focus-visible:outline-none focus-visible:ring-2",
      "focus-visible:ring-[var(--md-sys-color-primary)]",
      "focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--md-sys-color-surface)]",
      "disabled:cursor-not-allowed disabled:opacity-38",
      "transition-colors duration-[var(--md-sys-motion-duration-short3)]",
      // Checked state
      "data-[state=checked]:bg-[var(--md-sys-color-primary)]",
      "data-[state=checked]:border-[var(--md-sys-color-primary)]",
      "data-[state=checked]:text-[var(--md-sys-color-on-primary)]",
      // Indeterminate state
      "data-[state=indeterminate]:bg-[var(--md-sys-color-primary)]",
      "data-[state=indeterminate]:border-[var(--md-sys-color-primary)]",
      "data-[state=indeterminate]:text-[var(--md-sys-color-on-primary)]",
      className
    )}
    {...props}
  >
    <CheckboxPrimitive.Indicator className="flex items-center justify-center text-current">
      <span className="material-symbols-rounded text-[14px] font-bold">check</span>
    </CheckboxPrimitive.Indicator>
  </CheckboxPrimitive.Root>
))
Checkbox.displayName = CheckboxPrimitive.Root.displayName

export { Checkbox }
