import * as React from "react"
import * as TabsPrimitive from "@radix-ui/react-tabs"
import { cn } from "@/lib/utils"

/**
 * MD3 Tabs — Secondary tabs (fixed, underline indicator)
 * https://m3.material.io/components/tabs/overview
 *
 * - TabsList: transparent background, bottom border divider
 * - TabsTrigger: on-surface-variant text → primary on active
 * - Active indicator: 3px bottom border in primary color
 */

const Tabs = TabsPrimitive.Root

const TabsList = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.List
    ref={ref}
    className={cn(
      "inline-flex items-center",
      "border-b border-[var(--md-sys-color-surface-variant)]",
      "bg-transparent",
      className
    )}
    {...props}
  />
))
TabsList.displayName = TabsPrimitive.List.displayName

const TabsTrigger = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Trigger
    ref={ref}
    className={cn(
      "relative inline-flex items-center justify-center whitespace-nowrap",
      "h-12 px-4",
      "text-label-lg font-medium",
      "text-[var(--md-sys-color-on-surface-variant)]",
      "hover:bg-[color-mix(in_srgb,var(--md-sys-color-on-surface)_8%,transparent)]",
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--md-sys-color-primary)]",
      "disabled:pointer-events-none disabled:opacity-38",
      "transition-colors duration-[var(--md-sys-motion-duration-short3)]",
      // Active state
      "data-[state=active]:text-[var(--md-sys-color-primary)]",
      // Active indicator bar
      "after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[3px]",
      "after:rounded-t-full after:bg-[var(--md-sys-color-primary)]",
      "after:scale-x-0 after:transition-transform after:duration-[var(--md-sys-motion-duration-short4)]",
      "data-[state=active]:after:scale-x-100",
      className
    )}
    {...props}
  />
))
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName

const TabsContent = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Content
    ref={ref}
    className={cn(
      "mt-2",
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--md-sys-color-primary)]",
      className
    )}
    {...props}
  />
))
TabsContent.displayName = TabsPrimitive.Content.displayName

export { Tabs, TabsList, TabsTrigger, TabsContent }
