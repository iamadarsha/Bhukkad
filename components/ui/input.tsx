import * as React from "react"
import { cn } from "@/lib/utils"

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

/**
 * MD3 Filled Text Field
 * https://m3.material.io/components/text-fields/overview
 *
 * - Shape: extra-small top corners (4px), square bottom
 * - Background: surface-container-highest
 * - Bottom border: 1px on-surface-variant → 2px primary on focus
 */
const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-14 w-full",
          "rounded-t-[var(--md-sys-shape-corner-extra-small)] rounded-b-none",
          "bg-[var(--md-sys-color-surface-container-highest)]",
          "border-b border-[var(--md-sys-color-on-surface-variant)]",
          "px-4 pt-4 pb-2",
          "text-body-lg text-[var(--md-sys-color-on-surface)]",
          "placeholder:text-[var(--md-sys-color-on-surface-variant)]",
          "focus:outline-none focus:border-b-2 focus:border-[var(--md-sys-color-primary)]",
          "disabled:cursor-not-allowed disabled:opacity-38",
          "transition-[border-color] duration-[var(--md-sys-motion-duration-short3)]",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }
