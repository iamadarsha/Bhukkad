import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

/**
 * MD3 Badge:
 * - small: 6px dot (no number)
 * - default: pill with number, 16px height, error-container color
 */
const badgeVariants = cva(
  "inline-flex items-center justify-center font-medium transition-colors",
  {
    variants: {
      variant: {
        // MD3 Large Badge — error container color
        default:
          "rounded-full bg-[var(--md-sys-color-error)] text-[var(--md-sys-color-on-error)] text-label-sm min-w-4 h-4 px-1",
        // MD3 Small Badge — dot
        dot:
          "rounded-full bg-[var(--md-sys-color-error)] w-1.5 h-1.5",
        // Primary container badge
        primary:
          "rounded-full bg-[var(--md-sys-color-primary-container)] text-[var(--md-sys-color-on-primary-container)] text-label-sm min-w-4 h-4 px-1",
        // Secondary container badge
        secondary:
          "rounded-full bg-[var(--md-sys-color-secondary-container)] text-[var(--md-sys-color-on-secondary-container)] text-label-sm min-w-4 h-4 px-1",
        // Tertiary (loyalty/rewards)
        tertiary:
          "rounded-full bg-[var(--md-sys-color-tertiary-container)] text-[var(--md-sys-color-on-tertiary-container)] text-label-sm min-w-4 h-4 px-1",
        // Outlined chip-style badge
        outline:
          "rounded-full border border-[var(--md-sys-color-outline)] text-[var(--md-sys-color-on-surface-variant)] text-label-sm min-w-4 h-4 px-1",
        // Success
        success:
          "rounded-full bg-[#386A20] text-white text-label-sm min-w-4 h-4 px-1",
        // Warning
        warning:
          "rounded-full bg-[#7A5900] text-white text-label-sm min-w-4 h-4 px-1",
        destructive:
          "rounded-full bg-[var(--md-sys-color-error)] text-[var(--md-sys-color-on-error)] text-label-sm min-w-4 h-4 px-1",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
