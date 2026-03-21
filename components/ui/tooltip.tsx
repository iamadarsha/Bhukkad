import * as React from "react"
import * as TooltipPrimitive from "@radix-ui/react-tooltip"
import { cn } from "@/lib/utils"

/**
 * MD3 Tooltip (plain tooltip)
 * https://m3.material.io/components/tooltips/overview
 *
 * - Background: inverse-surface
 * - Text: inverse-on-surface
 * - Shape: extra-small (4px)
 * - Height: 24px minimum, padding: 4px 8px
 */

const TooltipProvider = TooltipPrimitive.Provider
const Tooltip = TooltipPrimitive.Root
const TooltipTrigger = TooltipPrimitive.Trigger

const TooltipContent = React.forwardRef<
  React.ElementRef<typeof TooltipPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content>
>(({ className, sideOffset = 4, ...props }, ref) => (
  <TooltipPrimitive.Content
    ref={ref}
    sideOffset={sideOffset}
    className={cn(
      "z-50 overflow-hidden",
      "rounded-[var(--md-sys-shape-corner-extra-small)]",
      "bg-[var(--md-sys-color-inverse-surface)]",
      "text-[var(--md-sys-color-inverse-on-surface)]",
      "px-2 py-1 text-label-sm",
      "animate-in fade-in-0 zoom-in-95",
      "data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95",
      "data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2",
      "data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
      className
    )}
    {...props}
  />
))
TooltipContent.displayName = TooltipPrimitive.Content.displayName

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider }
