import * as React from "react"
import * as SwitchPrimitives from "@radix-ui/react-switch"
import { cn } from "@/lib/utils"

/**
 * MD3 Switch
 * https://m3.material.io/components/switch/overview
 *
 * Off state:
 *   Track: outline (border) + surface-container-highest background, 52×32px
 *   Thumb: outline color, 16px → grows to 24px when pressed
 *
 * On state:
 *   Track: primary background, no border
 *   Thumb: on-primary, 24px
 */

const Switch = React.forwardRef<
  React.ElementRef<typeof SwitchPrimitives.Root>,
  React.ComponentPropsWithoutRef<typeof SwitchPrimitives.Root>
>(({ className, ...props }, ref) => (
  <SwitchPrimitives.Root
    className={cn(
      "peer inline-flex h-8 w-[52px] shrink-0 cursor-pointer items-center rounded-full",
      "border-2 transition-colors",
      "focus-visible:outline-none focus-visible:ring-2",
      "focus-visible:ring-[var(--md-sys-color-primary)]",
      "focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--md-sys-color-surface)]",
      "disabled:cursor-not-allowed disabled:opacity-38",
      // Off: outline border + surface-container-highest bg
      "data-[state=unchecked]:bg-[var(--md-sys-color-surface-container-highest)]",
      "data-[state=unchecked]:border-[var(--md-sys-color-outline)]",
      // On: primary bg, no visible border
      "data-[state=checked]:bg-[var(--md-sys-color-primary)]",
      "data-[state=checked]:border-[var(--md-sys-color-primary)]",
      className
    )}
    {...props}
    ref={ref}
  >
    <SwitchPrimitives.Thumb
      className={cn(
        "pointer-events-none block rounded-full shadow-elevation-1",
        "transition-all duration-[var(--md-sys-motion-duration-short4)]",
        // Off: 16px thumb in outline color, translate 4px from left
        "data-[state=unchecked]:h-4 data-[state=unchecked]:w-4",
        "data-[state=unchecked]:translate-x-1",
        "data-[state=unchecked]:bg-[var(--md-sys-color-outline)]",
        // On: 24px thumb in on-primary, translate to right
        "data-[state=checked]:h-6 data-[state=checked]:w-6",
        "data-[state=checked]:translate-x-[22px]",
        "data-[state=checked]:bg-[var(--md-sys-color-on-primary)]",
      )}
    />
  </SwitchPrimitives.Root>
))
Switch.displayName = SwitchPrimitives.Root.displayName

export { Switch }
