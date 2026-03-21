import * as React from "react"
import { cn } from "@/lib/utils"

const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement>
>(({ className, ...props }, ref) => {
  return (
    <textarea
      className={cn(
        "flex min-h-[80px] w-full rounded-[var(--md-sys-shape-corner-extra-small)]",
        "bg-[var(--md-sys-color-surface-container-highest)]",
        "border-b-2 border-[var(--md-sys-color-on-surface-variant)]",
        "px-3 py-2 text-body-md",
        "text-[var(--md-sys-color-on-surface)]",
        "placeholder:text-[var(--md-sys-color-on-surface-variant)]",
        "focus:outline-none focus:border-[var(--md-sys-color-primary)]",
        "disabled:cursor-not-allowed disabled:opacity-38",
        "resize-none",
        className
      )}
      ref={ref}
      {...props}
    />
  )
})
Textarea.displayName = "Textarea"

export { Textarea }
